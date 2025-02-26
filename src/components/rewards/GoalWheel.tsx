import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { WHEEL_ANIMATION } from '../../constants/animations';

export interface Goal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

// Main wheel container
const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
`;

// The wheel itself - now using motion.div for animation
const Wheel = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

// Dividing line for each segment
const SegmentDivider = styled.div<{ rotation: number }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 50%;
  background: ${({ theme }) => theme.colors.text.secondary};
  transform-origin: bottom center;
  transform: translateX(-50%) rotate(${props => props.rotation}deg);
`;

// Segment container that rotates to the correct position
const SegmentContainer = styled.div<{ rotation: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform: rotate(${props => props.rotation}deg);
`;

// Content wrapper to position the content at the correct distance from center
const ContentWrapper = styled.div`
  position: absolute;
  top: 60px; /* Distance from the edge of the wheel */
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  text-align: center;
`;

// The actual content (icon and name) that faces the center of the wheel
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  svg {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 14px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    line-height: 1.2;
  }
`;

// Pointer triangle at the top
const Pointer = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  width: 30px;
  height: 30px;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.accent};
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
  z-index: 10;
`;

// Highlighted segment - covers exactly one segment
const SelectedSegment = styled.div<{ index: number; segmentCount: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent}30;
  clip-path: ${props => {
    const segmentAngle = 360 / props.segmentCount;
    const startAngle = props.index * segmentAngle;
    const endAngle = startAngle + segmentAngle;
    
    // Calculate points for the segment
    const centerX = 50;
    const centerY = 50;
    const radius = 50;
    
    // Start at center
    let path = `${centerX}% ${centerY}%`;
    
    // Move to start of arc on the circle edge
    const startX = centerX + radius * Math.sin(startAngle * Math.PI / 180);
    const startY = centerY - radius * Math.cos(startAngle * Math.PI / 180);
    path += `, ${startX}% ${startY}%`;
    
    // Add points along the arc (more points = smoother curve)
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const angle = startAngle + (i / steps) * segmentAngle;
      const x = centerX + radius * Math.sin(angle * Math.PI / 180);
      const y = centerY - radius * Math.cos(angle * Math.PI / 180);
      path += `, ${x}% ${y}%`;
    }
    
    // Return to center
    path += `, ${centerX}% ${centerY}%`;
    
    return `polygon(${path})`;
  }};
  z-index: 1;
`;

interface GoalWheelProps {
  goals: Goal[];
  spinTrigger?: number; // A value that changes to trigger a new spin
  onSpinComplete?: (goal: Goal) => void;
}

export const GoalWheel: React.FC<GoalWheelProps> = ({ goals, spinTrigger = 0, onSpinComplete }) => {
  const controls = useAnimation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Constants for wheel geometry
  const segmentCount = 6;
  const segmentAngle = 360 / segmentCount;
  
  // Ensure we have exactly 6 goals to display
  const finalGoals = React.useMemo(() => {
    const displayGoals = [...goals];
    while (displayGoals.length < segmentCount) {
      displayGoals.push(goals[displayGoals.length % goals.length]);
    }
    return displayGoals.slice(0, segmentCount);
  }, [goals, segmentCount]);
  
  // Function to spin the wheel
  const spinWheel = async () => {
    // Don't start a new spin if already spinning
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Reset selected index when starting a new spin
    setSelectedIndex(null);
    
    // Wait for initial delay
    await new Promise(resolve => setTimeout(resolve, WHEEL_ANIMATION.INITIAL_DELAY));
    
    // Randomly select a goal
    const randomIndex = Math.floor(Math.random() * segmentCount);
    
    // Calculate rotation to position the selected segment at the top
    const segmentOffset = randomIndex * segmentAngle;
    const finalRotation = (WHEEL_ANIMATION.SPINS * 360) + (segmentOffset + segmentAngle / 2);
    
    try {
      // Fast initial spin (30% of the way)
      await controls.start({
        rotate: finalRotation * 0.3,
        transition: {
          duration: WHEEL_ANIMATION.SPIN_DURATION * 0.2 / 1000,
          ease: "circIn"
        }
      });
      
      // Slower deceleration to final position
      await controls.start({
        rotate: finalRotation,
        transition: {
          duration: WHEEL_ANIMATION.SPIN_DURATION * 0.8 / 1000,
          ease: "circOut",
          type: "spring",
          damping: 15,
          stiffness: 50
        }
      });
      
      // Calculate which segment is at the top after rotation
      const normalizedRotation = finalRotation % 360;
      const invertedRotation = (360 - normalizedRotation) % 360;
      const topSegmentIndex = Math.floor(invertedRotation / segmentAngle) % segmentCount;
      
      // Update selected segment
      setSelectedIndex(topSegmentIndex);
      
      // Wait for completion delay
      await new Promise(resolve => setTimeout(resolve, WHEEL_ANIMATION.COMPLETION_DELAY));
      
      // Call the completion callback if provided
      if (onSpinComplete) {
        onSpinComplete(finalGoals[topSegmentIndex]);
      }
    } catch (error) {
      console.error('Animation error:', error);
    } finally {
      setIsSpinning(false);
    }
  };
  
  // Trigger spin when spinTrigger changes
  useEffect(() => {
    if (spinTrigger > 0) {
      spinWheel();
    }
  }, [spinTrigger]);
  
  return (
    <WheelContainer>
      <Wheel
        animate={controls}
        initial={{ rotate: 0 }}
      >
        {/* Segment dividing lines */}
        {Array.from({ length: segmentCount }).map((_, index) => (
          <SegmentDivider
            key={`divider-${index}`}
            rotation={index * segmentAngle}
          />
        ))}
        
        {/* Selected segment highlight */}
        {selectedIndex !== null && (
          <SelectedSegment 
            index={selectedIndex}
            segmentCount={segmentCount}
          />
        )}
        
        {/* Contents of each segment */}
        {finalGoals.map((goal, index) => (
          <SegmentContainer
            key={goal.id || `goal-${index}`}
            rotation={index * segmentAngle + segmentAngle / 2} // Position in the middle of segment
          >
            <ContentWrapper>
              <Content>
                {goal.icon}
                <span>{goal.name}</span>
              </Content>
            </ContentWrapper>
          </SegmentContainer>
        ))}
      </Wheel>
      <Pointer />
    </WheelContainer>
  );
}; 