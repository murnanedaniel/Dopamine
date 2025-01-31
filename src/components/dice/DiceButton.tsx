import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDice } from 'react-icons/fa';

interface DiceButtonProps {
  onClick: () => void;
  isRolling?: boolean;
}

const StyledDiceButton = styled(motion.button)`
  width: 200px;
  height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 100px;
    height: 100px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DiceButton: React.FC<DiceButtonProps> = ({ onClick, isRolling = false }) => {
  return (
    <StyledDiceButton
      onClick={onClick}
      disabled={isRolling}
      animate={isRolling ? { rotate: 360 } : {}}
      transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
    >
      <FaDice />
    </StyledDiceButton>
  );
}; 