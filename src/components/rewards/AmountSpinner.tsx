import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const SpinnerContainer = styled.div`
  position: relative;
  width: 200px;
  height: 150px;
  margin: 0 auto;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const SpinnerWindow = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid ${({ theme }) => theme.colors.accent};
  border-bottom: 2px solid ${({ theme }) => theme.colors.accent};
`;

const SpinnerTrack = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpinnerItem = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface AmountSpinnerProps {
  type: 'money' | 'time';
  onSpinComplete: (amount: number) => void;
}

export const AmountSpinner: React.FC<AmountSpinnerProps> = ({ type, onSpinComplete }) => {
  const controls = useAnimation();

  // Generate amounts with logarithmic distribution
  const generateAmounts = () => {
    const amounts: number[] = [];
    const min = type === 'money' ? 1 : 1;
    const max = type === 'money' ? 100 : 120;
    
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const amount = Math.round(min + (max - min) * Math.exp(t * Math.log(max / min)));
      if (!amounts.includes(amount)) {
        amounts.push(amount);
      }
    }
    return amounts.sort((a, b) => a - b);
  };

  const amounts = generateAmounts();
  const itemHeight = 50;

  const getRandomAmount = () => {
    const random = Math.random();
    const index = Math.floor(Math.log(random) / Math.log(0.5));
    return amounts[Math.min(index, amounts.length - 1)];
  };

  useEffect(() => {
    let mounted = true;

    const animate = async () => {
      // Wait for initial mount
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!mounted) return;

      const spins = 3;
      const finalAmount = getRandomAmount();
      const finalIndex = amounts.indexOf(finalAmount);
      const totalDistance = (spins * amounts.length + finalIndex) * itemHeight;

      try {
        // Start with fast spinning
        await controls.start({
          y: [-totalDistance / 4],
          transition: {
            duration: 1,
            ease: "linear"
          }
        });

        if (!mounted) return;

        // Then slow down to final position
        await controls.start({
          y: [-totalDistance],
          transition: {
            duration: 4,
            ease: "circOut",
            times: [0, 1]
          }
        });

        if (!mounted) return;

        // Wait before completing
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!mounted) return;

        onSpinComplete(finalAmount);
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    controls.set({ y: 0 });
    animate();

    return () => {
      mounted = false;
    };
  }, [controls, amounts, itemHeight, onSpinComplete]);

  return (
    <div style={{ textAlign: 'center' }}>
      <SpinnerContainer>
        <SpinnerWindow>
          <SpinnerTrack
            animate={controls}
            initial={{ y: 0 }}
          >
            {[...amounts, ...amounts, ...amounts, ...amounts, ...amounts].map((amount, index) => (
              <SpinnerItem key={index}>
                {amount}{type === 'money' ? '$' : 'm'}
              </SpinnerItem>
            ))}
          </SpinnerTrack>
        </SpinnerWindow>
      </SpinnerContainer>
    </div>
  );
}; 