import React from 'react';
import styled from 'styled-components';
import { FaBook, FaRobot, FaPlane, FaChartLine, FaPiggyBank, FaLightbulb } from 'react-icons/fa';

interface Goal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const GOALS: Goal[] = [
  { id: 'books', name: 'Books', icon: <FaBook />, description: 'Investment in knowledge' },
  { id: 'robotics', name: 'Robotics', icon: <FaRobot />, description: 'Building the future' },
  { id: 'travel', name: 'Travel', icon: <FaPlane />, description: 'Exploring the world' },
  { id: 'stocks', name: 'Stocks', icon: <FaChartLine />, description: 'Growing wealth' },
  { id: 'savings', name: 'Savings', icon: <FaPiggyBank />, description: 'Future security' },
  { id: 'startup', name: 'Startup', icon: <FaLightbulb />, description: 'Entrepreneurship' }
];

const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
  border: 1px dashed ${({ theme }) => theme.colors.text.secondary}; /* Debug border */
`;

const Wheel = styled.div<{ finalRotation: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.large};
  transform: rotate(${props => props.finalRotation}deg);
`;

const WheelSegment = styled.div<{ rotation: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Each segment border at multiples of segmentAngle */
  transform: rotate(${props => props.rotation}deg);
  transform-origin: center;

  /* Debug border (red line) at each segment boundary */
  &::after {
    content: '${props => props.rotation}°';
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: 50%;
    background-color: rgba(255, 0, 0, 0.2);
    transform-origin: bottom;
    
    font-size: 12px;
    color: red;
    transform: translateX(-50%) translateY(-20px);
    font-family: monospace;
  }

  /* Dividing line (black) halfway between segments (should match icon centers) */
  &::before {
    content: '${props => props.rotation + 30}°';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 50%;
    background-color: ${({ theme }) => theme.colors.text.secondary};
    transform: translateX(-50%);
    
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.secondary};
    transform: translateX(-50%) translateY(-20px);
    font-family: monospace;
  }
`;

const SegmentContent = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  /* This will be overridden by inline style to center icon in its segment */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 80px;
  text-align: center;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    
    svg {
      font-size: 24px;
    }

    span {
      font-size: 14px;
      line-height: 1.2;
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

// Debug component to show center point
const CenterPoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

// Debug circle to show full wheel boundary and 0° marker
const DebugCircle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px dashed ${({ theme }) => theme.colors.text.secondary};
  border-radius: 50%;
  pointer-events: none;
  
  &::after {
    content: '0°';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-family: monospace;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const TestContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
`;

const SelectedGoal = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  min-width: 400px;  /* Increase to show more debug info */

  h3 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  .debug-info {
    font-family: monospace;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-top: 1rem;
    white-space: pre-wrap;
  }
`;

export const GoalWheelTest: React.FC = () => {
  const segmentAngle = 360 / GOALS.length; // should be 60°
  // Set initial rotation offset = –(segmentAngle/2) so the pointer (at 0°) starts at the center of segment 0
  const initialRotation = -segmentAngle / 2; // -30°
  
  // Generate a random spin value (simulate the spinRotation)
  const [currentRotation] = React.useState(() => Math.random() * 360);
  
  // Final rotation applied to the wheel
  const finalRotation = initialRotation + currentRotation;

  // Selection logic:
  // Since with no spin, the center of segment 0 is at 0°,
  // the world center for segment i becomes: worldCenter(i) = i * segmentAngle + currentRotation.
  // The selected segment is the one whose center is nearest 0° (the pointer position).
  // We can compute the selected index as:
  const r = currentRotation % 360; // current spin rotation normalized
  const selectedIndex = Math.floor((360 - r + (segmentAngle / 2)) / segmentAngle) % GOALS.length;
  const selectedGoal = GOALS[selectedIndex];

  // For debugging, compute world centers for all segments:
  // World center for segment i = (i * segmentAngle + 30 + finalRotation) mod 360.
  // But note: since finalRotation = currentRotation - 30,
  // world center for segment i = i*segmentAngle + currentRotation.
  const allSegments = GOALS.map((goal, index) => {
    const center = (index * segmentAngle + currentRotation) % 360;
    const normalizedCenter = center < 0 ? center + 360 : center;
    return {
      goal,
      start: index * segmentAngle,
      end: (index + 1) * segmentAngle,
      center: normalizedCenter
    };
  });
  const segmentBoundsText = allSegments
    .map(({ goal, start, end, center }) => 
      `${goal.name.padEnd(10)}: ${start.toFixed(1)}° to ${end.toFixed(1)}° (world center: ${center.toFixed(1)}°) ${
        (normalizedAngle(selectedGoal, currentRotation, segmentAngle) >= start && normalizedAngle(selectedGoal, currentRotation, segmentAngle) < end) ? '  <<<< SELECTED' : ''
      }`
    )
    .join('\n');

  // For debug: compute pointer position relative to the spinning wheel.
  // The pointer is fixed at 0°. Given that world center for segment i = i*60 + currentRotation,
  // and our selection is based on: selectedIndex = floor((360 - currentRotation + 30)/60) mod 6.
  // We'll show r and selectedIndex.
  
  return (
    <TestContainer>
      <WheelContainer>
        <DebugCircle />
        <Wheel finalRotation={finalRotation}>
          {GOALS.map((goal, index) => {
            // Segment border at index*segmentAngle
            const segmentStart = index * segmentAngle;
            // Icon should be centered at segmentStart + segmentAngle/2
            const iconCenter = segmentStart + (segmentAngle / 2);
            
            return (
              <WheelSegment key={goal.id} rotation={segmentStart}>
                <SegmentContent style={{ transform: `translateX(-50%) rotate(${iconCenter}deg)` }}>
                  <div className="content" style={{ transform: `rotate(-${iconCenter}deg)` }}>
                    {goal.icon}
                    <span>{goal.name}</span>
                  </div>
                </SegmentContent>
              </WheelSegment>
            );
          })}
        </Wheel>
        <Pointer />
        <CenterPoint />
      </WheelContainer>

      <SelectedGoal>
        <h3>Selected Goal</h3>
        <div className="content">
          {selectedGoal.icon}
          <span>{selectedGoal.name}</span>
          <p>{selectedGoal.description}</p>
        </div>
        <div className="debug-info">
{`Wheel Debug Info:
• Current Rotation (spin value): ${currentRotation.toFixed(2)}°
• Initial Offset: ${initialRotation}°
• Final Wheel Rotation: ${finalRotation.toFixed(2)}°
• Selected Index: ${selectedIndex}
• Selected Goal: ${selectedGoal.name}

Segment Bounds (based on static segments):
${allSegments.map(seg => 
  `${seg.goal.name.padEnd(10)}: ${seg.start.toFixed(1)}° to ${seg.end.toFixed(1)}° (world center: ${seg.center.toFixed(1)}°)`
).join('\n')}
`}
        </div>
      </SelectedGoal>
    </TestContainer>
  );
};

// Helper: We want a function to compute the relative world angle for the selected goal (for debugging)
// In our new system, world center for segment i = i*60 + currentRotation (mod 360).
// But this helper is just illustrative.
function normalizedAngle(goal: Goal, currentRotation: number, segmentAngle: number): number {
  // Find index of the goal in GOALS array
  const index = GOALS.findIndex(g => g.id === goal.id);
  const center = (index * segmentAngle + currentRotation) % 360;
  return center < 0 ? center + 360 : center;
}