import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { DiceButton } from '../dice/DiceButton';
import { RewardsContainer } from '../rewards/RewardsContainer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ResultText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

export const GameContainer: React.FC = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showRewards, setShowRewards] = useState(false);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setShowRewards(false);
    setResult(null);
    
    // Simulate dice roll animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setResult(roll);
      setIsRolling(false);
      
      if (roll >= 4) {
        setTimeout(() => {
          setShowRewards(true);
        }, 1000); // Show rewards after 1 second on success
      }
    }, 1500);
  }, []);

  const handleRewardsComplete = useCallback(() => {
    setShowRewards(false);
    setResult(null);
  }, []);

  const getResultMessage = (roll: number) => {
    if (roll >= 4) {
      return `Success! You rolled a ${roll} 🎉`;
    }
    return `Keep trying! You rolled a ${roll} 💪`;
  };

  return (
    <>
      <Container>
        <DiceButton onClick={rollDice} isRolling={isRolling} />
        {result && !isRolling && !showRewards && (
          <ResultText>
            {getResultMessage(result)}
          </ResultText>
        )}
      </Container>
      <RewardsContainer 
        isVisible={showRewards} 
        onComplete={handleRewardsComplete}
      />
    </>
  );
}; 