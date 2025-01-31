import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaClock, FaDollarSign } from 'react-icons/fa';

export type ContributionType = 'time' | 'money';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

interface ToggleButtonProps {
  isSelected: boolean;
}

const ToggleButton = styled(motion.button)<ToggleButtonProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.background : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: none;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.normal};

  svg {
    width: 1.2em;
    height: 1.2em;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

interface ContributionTypeSelectorProps {
  selectedType: ContributionType;
  onSelect: (type: ContributionType) => void;
}

export const ContributionTypeSelector: React.FC<ContributionTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <Container>
      <Title>How would you like to contribute?</Title>
      <ToggleContainer>
        <ToggleButton
          isSelected={selectedType === 'time'}
          onClick={() => onSelect('time')}
          whileTap={{ scale: 0.95 }}
        >
          <FaClock /> Time
        </ToggleButton>
        <ToggleButton
          isSelected={selectedType === 'money'}
          onClick={() => onSelect('money')}
          whileTap={{ scale: 0.95 }}
        >
          <FaDollarSign /> Money
        </ToggleButton>
      </ToggleContainer>
    </Container>
  );
}; 