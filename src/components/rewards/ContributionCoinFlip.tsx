import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaClock, FaDollarSign } from 'react-icons/fa';
import { COIN_ANIMATION } from '../../constants/animations';

const CoinContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  perspective: 1000px;
  margin: 0 auto;
`;

const Coin = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const CoinSide = styled.div<{ side: 'front' | 'back' }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transform: ${props => props.side === 'back' ? 'rotateY(180deg)' : 'none'};
`;

const ResultText = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

interface ContributionCoinFlipProps {
  onFlipComplete: (type: 'money' | 'time') => void;
}

export const ContributionCoinFlip: React.FC<ContributionCoinFlipProps> = ({ onFlipComplete }) => {
  const controls = useAnimation();

  useEffect(() => {
    let mounted = true;

    const animate = async () => {
      // Wait for initial mount
      await new Promise(resolve => setTimeout(resolve, COIN_ANIMATION.INITIAL_DELAY));
      if (!mounted) return;

      // Generate a random number of flips between 2 and 4
      const minFlips = 2;
      const maxFlips = 7;
      const flips = Math.floor(Math.random() * (maxFlips - minFlips + 1)) + minFlips;
      
      const randomResult: 'money' | 'time' = Math.random() < 0.5 ? 'money' : 'time';
      const finalRotation = (flips * 360) + (randomResult === 'money' ? 0 : 180);

      try {
        // First do some quick flips
        await controls.start({
          rotateY: [-20, 20],
          transition: {
            duration: 0.3,
            repeat: 3,
            repeatType: "mirror"
          }
        });

        if (!mounted) return;

        // Then do the main flipping animation
        await controls.start({
          rotateY: [0, finalRotation],
          transition: {
            duration: COIN_ANIMATION.FLIP_DURATION / 1000,
            ease: COIN_ANIMATION.EASE,
            times: [0, 1]
          }
        });

        if (!mounted) return;

        // Wait before completing
        await new Promise(resolve => setTimeout(resolve, COIN_ANIMATION.COMPLETION_DELAY));
        if (!mounted) return;

        onFlipComplete(randomResult);
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    animate();

    return () => {
      mounted = false;
    };
  }, [controls, onFlipComplete]);

  return (
    <div>
      <CoinContainer>
        <Coin animate={controls} initial={{ rotateY: 0 }}>
          <CoinSide side="front">
            <FaDollarSign />
          </CoinSide>
          <CoinSide side="back">
            <FaClock />
          </CoinSide>
        </Coin>
      </CoinContainer>
    </div>
  );
}; 