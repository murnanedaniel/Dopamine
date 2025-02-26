import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBook, FaRobot, FaPlane, FaChartLine, FaPiggyBank, FaLightbulb } from 'react-icons/fa';
import { GoalWheel, Goal } from '../rewards/GoalWheel';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
`;

const TestControls = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a80d2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LogOutput = styled.pre`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  min-height: 200px;
  overflow: auto;
`;

// Sample goals for testing
const TEST_GOALS: Goal[] = [
  { id: 'books', name: 'Books', icon: <FaBook />, description: 'Investment in knowledge' },
  { id: 'robotics', name: 'Robotics', icon: <FaRobot />, description: 'Building the future' },
  { id: 'travel', name: 'Travel', icon: <FaPlane />, description: 'Exploring the world' },
  { id: 'stocks', name: 'Stocks', icon: <FaChartLine />, description: 'Growing wealth' },
  { id: 'savings', name: 'Savings', icon: <FaPiggyBank />, description: 'Future security' },
  { id: 'startup', name: 'Startup', icon: <FaLightbulb />, description: 'Entrepreneurship' }
];

export const GoalWheelTestPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [spinTrigger, setSpinTrigger] = useState(0);

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    console.log('Selected goal:', goal);
  };

  const handleSpinClick = () => {
    setSpinTrigger(prev => prev + 1);
  };

  return (
    <PageContainer>
      <Title>Goal Wheel Test</Title>
      
      <GoalWheel 
        goals={TEST_GOALS} 
        spinTrigger={spinTrigger}
        onSpinComplete={handleGoalSelect} 
      />
      
      <TestControls>
        <Button onClick={handleSpinClick}>Spin the Wheel</Button>
        
        {selectedGoal && (
          <div>
            <h3>Selected Goal:</h3>
            <p>{selectedGoal.name} ({selectedGoal.id})</p>
          </div>
        )}
      </TestControls>
    </PageContainer>
  );
}; 