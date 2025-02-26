import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { SPINNER_ANIMATION } from '../../constants/animations';
import { getAmountsByType } from '../../constants/amounts';

const SpinnerContainer = styled.div`
  position: relative;
  width: 200px;
  height: ${SPINNER_ANIMATION.ITEM_HEIGHT * 3}px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  overflow: hidden;
`;

const SpinnerWindow = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: ${SPINNER_ANIMATION.ITEM_HEIGHT}px;
    z-index: 2;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.background} 0%,
      transparent 100%
    );
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
    transform: rotate(180deg);
  }
`;

const SpinnerTrack = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform;
`;

const SpinnerItem = styled.div<{ isCenter?: boolean; isSelected?: boolean }>`
  height: ${SPINNER_ANIMATION.ITEM_HEIGHT}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme, isCenter }) => 
    isCenter 
      ? theme.typography.fontSize.h2 
      : theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, isCenter, isSelected }) => 
    isSelected
      ? theme.colors.accent
      : isCenter 
        ? theme.colors.text.primary 
        : theme.colors.text.secondary};
  opacity: ${({ isCenter }) => isCenter ? 1 : 0.6};
  transition: all 0.2s ease;
`;

const SelectedFrame = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: ${SPINNER_ANIMATION.ITEM_HEIGHT}px;
  height: ${SPINNER_ANIMATION.ITEM_HEIGHT}px;
  border-top: 2px solid ${({ theme }) => theme.colors.accent};
  border-bottom: 2px solid ${({ theme }) => theme.colors.accent};
  pointer-events: none;
  z-index: 2;
`;

interface AmountSpinnerProps {
  type: 'money' | 'time';
  spinTrigger?: number;
  onSpinComplete: (amount: number) => void;
}

export const AmountSpinner: React.FC<AmountSpinnerProps> = ({ 
  type, 
  spinTrigger = 0, 
  onSpinComplete 
}) => {
  // Core state
  const [amounts, setAmounts] = useState<number[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Refs
  const controls = useAnimation();
  const trackRef = useRef<HTMLDivElement>(null);
  const prevSpinTriggerRef = useRef<number>(0);
  const hasSpunRef = useRef<boolean>(false);
  
  // Get amounts from constants when type changes or when component mounts
  // This will ensure we get the latest settings
  useEffect(() => {
    setAmounts(getAmountsByType(type));
  }, [type]);
  
  // Get a random amount from the available amounts
  const getRandomAmount = useCallback(() => {
    if (amounts.length === 0) return 1;
    return amounts[Math.floor(Math.random() * amounts.length)];
  }, [amounts]);
  
  // Calculate which amount is visible at the center
  const calculateVisibleAmount = useCallback((yPosition: number) => {
    if (amounts.length === 0) return null;
    
    const itemHeight = SPINNER_ANIMATION.ITEM_HEIGHT;
    const totalItems = amounts.length;
    const absoluteY = Math.abs(yPosition);
    
    // Find which item is at the center
    // Add itemHeight to account for the initial offset and ensure correct alignment
    const centerPosition = (absoluteY + itemHeight) % (totalItems * itemHeight);
    const itemIndex = Math.floor(centerPosition / itemHeight) % totalItems;
    
    return amounts[itemIndex] || null;
  }, [amounts]);
  
  // Spin the spinner
  const spinSpinner = useCallback(async () => {
    if (isSpinning || amounts.length === 0) return;
    
    setIsSpinning(true);
    
    try {
      // Select a random amount
      const randomAmount = getRandomAmount();
      const targetIndex = amounts.indexOf(randomAmount);
      
      if (targetIndex === -1) {
        setIsSpinning(false);
        return;
      }
      
      // Calculate final position
      const itemHeight = SPINNER_ANIMATION.ITEM_HEIGHT;
      const totalItems = amounts.length;
      const totalSpins = SPINNER_ANIMATION.SPINS;
      const finalY = -(totalSpins * totalItems * itemHeight + targetIndex * itemHeight + itemHeight);
      
      // Set initial position if first spin
      if (!hasSpunRef.current) {
        controls.set({ y: -itemHeight });
      }
      
      // Wait for initial delay
      await new Promise(resolve => setTimeout(resolve, SPINNER_ANIMATION.INITIAL_DELAY));
      
      // Perform the animation
      await controls.start({
        y: finalY,
        transition: {
          duration: (SPINNER_ANIMATION.FAST_SPIN_DURATION + SPINNER_ANIMATION.SLOW_SPIN_DURATION) / 1000,
          ease: [0.2, 0, 0.35, 1], // Custom ease that starts fast and slows down
        }
      });
      
      // Get the final visible amount
      const finalVisible = calculateVisibleAmount(finalY);
      const finalAmount = finalVisible || randomAmount;
      setSelectedAmount(finalAmount);
      
      // Wait for completion delay
      await new Promise(resolve => setTimeout(resolve, SPINNER_ANIMATION.COMPLETION_DELAY));
      
      // Signal completion
      onSpinComplete(finalAmount);
      hasSpunRef.current = true;
    } catch (error) {
      console.error('Animation error:', error);
    } finally {
      setIsSpinning(false);
    }
  }, [amounts, controls, isSpinning, getRandomAmount, calculateVisibleAmount, onSpinComplete]);
  
  // Trigger spin when spinTrigger changes
  useEffect(() => {
    if (spinTrigger > 0 && spinTrigger !== prevSpinTriggerRef.current) {
      prevSpinTriggerRef.current = spinTrigger;
      spinSpinner();
    }
  }, [spinTrigger, spinSpinner]);
  
  // Render spinner items
  const renderSpinnerItems = useCallback(() => {
    if (amounts.length === 0) return null;
    
    const items: React.ReactNode[] = [];
    const repeatCount = 5; // Fewer repeats for better performance
    const centerIndex = Math.floor(amounts.length / 2);
    
    for (let i = 0; i < repeatCount; i++) {
      amounts.forEach((amount, idx) => {
        const itemIndex = i * amounts.length + idx;
        // The center item is the one that should be in the middle of the visible window
        const isCenter = idx === centerIndex && i === Math.floor(repeatCount / 2);
        
        items.push(
          <SpinnerItem 
            key={`${i}-${amount}`}
            isCenter={isCenter}
            isSelected={amount === selectedAmount}
          >
            {type === 'money' ? '$' : ''}{amount}{type === 'time' ? 'm' : ''}
          </SpinnerItem>
        );
      });
    }
    
    return items;
  }, [amounts, selectedAmount, type]);

  return (
    <SpinnerContainer>
      <SpinnerWindow>
        <SelectedFrame />
        <SpinnerTrack
          ref={trackRef}
          animate={controls}
          initial={{ y: -SPINNER_ANIMATION.ITEM_HEIGHT }}
        >
          {renderSpinnerItems()}
        </SpinnerTrack>
      </SpinnerWindow>
    </SpinnerContainer>
  );
}; 