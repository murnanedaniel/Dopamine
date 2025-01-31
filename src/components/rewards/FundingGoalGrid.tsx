import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBook, FaRobot, FaPlane, FaChartLine, FaPiggyBank, FaLightbulb } from 'react-icons/fa';

interface FundingGoal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const FUNDING_GOALS: FundingGoal[] = [
  {
    id: 'books',
    name: 'Books',
    icon: <FaBook />,
    description: 'Expand your knowledge'
  },
  {
    id: 'robotics',
    name: 'Robotics',
    icon: <FaRobot />,
    description: 'Build the future'
  },
  {
    id: 'travels',
    name: 'Travels',
    icon: <FaPlane />,
    description: 'Explore the world'
  },
  {
    id: 'stocks',
    name: 'Stocks',
    icon: <FaChartLine />,
    description: 'Invest in growth'
  },
  {
    id: 'savings',
    name: 'Long-term Savings',
    icon: <FaPiggyBank />,
    description: 'Secure your future'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    icon: <FaLightbulb />,
    description: 'Launch your ideas'
  }
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const GoalCard = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    outline: none;
  }

  svg {
    width: 2.5rem;
    height: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const GoalName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const GoalDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  text-align: center;
`;

interface FundingGoalGridProps {
  onSelectGoal: (goal: FundingGoal) => void;
}

export const FundingGoalGrid: React.FC<FundingGoalGridProps> = ({ onSelectGoal }) => {
  return (
    <Grid>
      {FUNDING_GOALS.map((goal) => (
        <GoalCard
          key={goal.id}
          onClick={() => onSelectGoal(goal)}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {goal.icon}
          <GoalName>{goal.name}</GoalName>
          <GoalDescription>{goal.description}</GoalDescription>
        </GoalCard>
      ))}
    </Grid>
  );
}; 