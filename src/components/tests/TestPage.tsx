import React from 'react';
import styled from 'styled-components';
import { GoalWheelTest } from './GoalWheelTest';

const TestContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TestSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const TestPage: React.FC = () => {
  return (
    <TestContainer>
      <TestSection>
        <h2>Goal Wheel Test</h2>
        <GoalWheelTest />
      </TestSection>
    </TestContainer>
  );
}; 