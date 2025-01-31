import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ContributionType } from './ContributionTypeSelector';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SliderContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    box-shadow: ${({ theme }) => theme.shadows.small};

    &:hover {
      transform: scale(1.2);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
  }
`;

const Value = styled(motion.div)`
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

interface ContributionAmountSelectorProps {
  type: ContributionType;
  onSelect: (amount: number) => void;
}

export const ContributionAmountSelector: React.FC<ContributionAmountSelectorProps> = ({
  type,
  onSelect,
}) => {
  const [sliderValue, setSliderValue] = useState(50);

  const calculateAmount = useCallback((value: number) => {
    if (type === 'money') {
      // Logarithmic scale from $1 to $100
      return Math.round(Math.exp(Math.log(1) + (Math.log(100) - Math.log(1)) * (value / 100)));
    } else {
      // Logarithmic scale from 1 to 120 minutes
      return Math.round(Math.exp(Math.log(1) + (Math.log(120) - Math.log(1)) * (value / 100)));
    }
  }, [type]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);
    onSelect(calculateAmount(value));
  };

  const formatValue = (amount: number) => {
    if (type === 'money') {
      return `$${amount}`;
    }
    return `${amount} min`;
  };

  return (
    <Container>
      <Title>Select your contribution amount</Title>
      <Value
        key={calculateAmount(sliderValue)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {formatValue(calculateAmount(sliderValue))}
      </Value>
      <SliderContainer>
        <Slider
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleChange}
        />
      </SliderContainer>
    </Container>
  );
}; 