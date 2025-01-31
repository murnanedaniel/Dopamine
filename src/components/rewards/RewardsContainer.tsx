import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBook, FaRobot, FaPlane, FaChartLine, FaPiggyBank, FaLightbulb } from 'react-icons/fa';
import { saveContribution } from '../../utils/storage';
import { GoalWheel, Goal } from './GoalWheel';
import { ContributionCoinFlip } from './ContributionCoinFlip';
import { AmountSpinner } from './AmountSpinner';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const StepContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.success};
`;

const Button = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.small};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FUNDING_GOALS: Goal[] = [
  { id: 'books', name: 'Books', icon: <FaBook />, description: 'Investment in knowledge' },
  { id: 'robotics', name: 'Robotics', icon: <FaRobot />, description: 'Building the future' },
  { id: 'travel', name: 'Travel', icon: <FaPlane />, description: 'Exploring the world' },
  { id: 'stocks', name: 'Stocks', icon: <FaChartLine />, description: 'Growing wealth' },
  { id: 'savings', name: 'Savings', icon: <FaPiggyBank />, description: 'Future security' },
  { id: 'startup', name: 'Startup', icon: <FaLightbulb />, description: 'Entrepreneurship' }
];

interface RewardsContainerProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export const RewardsContainer: React.FC<RewardsContainerProps> = ({ 
  isVisible,
  onComplete 
}) => {
  type Step = 'goal' | 'type' | 'amount' | 'success';
  const [currentStep, setCurrentStep] = useState<Step>('goal');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [contributionType, setContributionType] = useState<'money' | 'time'>('money');
  const [amount, setAmount] = useState<number>(0);

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    setTimeout(() => setCurrentStep('type'), 1000);
  };

  const handleTypeSelect = (type: 'money' | 'time') => {
    setContributionType(type);
    setTimeout(() => setCurrentStep('amount'), 1000);
  };

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    if (selectedGoal) {
      saveContribution({
        goalId: selectedGoal.id,
        goalName: selectedGoal.name,
        type: contributionType,
        amount: value
      });
      setTimeout(() => setCurrentStep('success'), 1000);
    }
  };

  const handleReset = () => {
    setSelectedGoal(null);
    setContributionType('money');
    setAmount(0);
    setCurrentStep('goal');
    onComplete?.();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'goal':
        return (
          <StepContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Title>Let's see what you'll be rewarded with...</Title>
            <GoalWheel goals={FUNDING_GOALS} onSpinComplete={handleGoalSelect} />
          </StepContainer>
        );
      case 'type':
        return (
          <StepContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Title>Time or Money?</Title>
            <ContributionCoinFlip onFlipComplete={handleTypeSelect} />
          </StepContainer>
        );
      case 'amount':
        return (
          <StepContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Title>Your contribution amount...</Title>
            <AmountSpinner type={contributionType} onSpinComplete={handleAmountSelect} />
          </StepContainer>
        );
      case 'success':
        return (
          <StepContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessMessage>
              <Title>Contribution Saved! 🎉</Title>
              <p>You've committed to contribute {amount} {contributionType === 'money' ? 'dollars' : 'minutes'} to {selectedGoal?.name}.</p>
              <Button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </Button>
            </SuccessMessage>
          </StepContainer>
        );
    }
  };

  return (
    <Container className={isVisible ? 'visible' : ''}>
      {renderCurrentStep()}
    </Container>
  );
}; 