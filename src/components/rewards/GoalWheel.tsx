import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

export interface Goal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
`;

const Wheel = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.large};
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
`;

const WheelSegment = styled.div<{ rotation: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(${props => props.rotation}deg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 50%;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.text.secondary};
    transform-origin: bottom center;
  }

  .content {
    transform: rotate(${props => -props.rotation}deg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 40px;
    
    svg {
      font-size: 24px;
      margin-bottom: 4px;
    }
  }

  &.active .content {
    color: ${({ theme }) => theme.colors.accent};
    svg {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const Pointer = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.accent};
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  z-index: 2;
`;

interface GoalWheelProps {
  goals: Goal[];
  onSpinComplete: (goal: Goal) => void;
}

export const GoalWheel: React.FC<GoalWheelProps> = ({ goals, onSpinComplete }) => {
  const controls = useAnimation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const animate = async () => {
      // Wait for initial mount
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!mounted) return;

      const spins = 5;
      const randomIndex = Math.floor(Math.random() * goals.length);
      const segmentAngle = 360 / goals.length;
      const finalAngle = (spins * 360) + (360 - (randomIndex * segmentAngle));

      try {
        await controls.start({
          rotate: [0, -finalAngle],
          transition: {
            duration: 5,
            ease: "easeOut",
            times: [0, 1]
          }
        });

        if (!mounted) return;
        setSelectedIndex(randomIndex);
        
        // Wait before completing
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!mounted) return;
        
        onSpinComplete(goals[randomIndex]);
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    animate();

    return () => {
      mounted = false;
    };
  }, [controls, goals, onSpinComplete]);

  return (
    <WheelContainer>
      <Wheel
        animate={controls}
        initial={{ rotate: 0 }}
      >
        {goals.map((goal, index) => {
          const rotation = (index * 360) / goals.length;
          return (
            <WheelSegment
              key={goal.id}
              rotation={rotation}
              className={selectedIndex === index ? 'active' : ''}
            >
              <div className="content">
                {goal.icon}
                <span>{goal.name}</span>
              </div>
            </WheelSegment>
          );
        })}
      </Wheel>
      <Pointer />
    </WheelContainer>
  );
}; 