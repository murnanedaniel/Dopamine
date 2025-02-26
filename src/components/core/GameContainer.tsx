import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { DiceButton } from '../dice/DiceButton';
import { RewardsContainer } from '../rewards/RewardsContainer';
import { StatsView } from '../stats/StatsView';
import { SettingsView } from '../settings/SettingsView';
import { FaChartBar, FaCog } from 'react-icons/fa';

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

const ActionButtonsContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

export const GameContainer: React.FC = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleToggleStats = useCallback(() => {
    setShowStats(prev => !prev);
    setShowSettings(false);
  }, []);

  const handleToggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
    setShowStats(false);
  }, []);

  const getResultMessage = (roll: number) => {
    if (roll >= 4) {
      return `Success! You rolled a ${roll} 🎉`;
    }
    return `Keep trying! You rolled a ${roll} 💪`;
  };

  if (showStats) {
    return <StatsView onBack={handleToggleStats} />;
  }

  if (showSettings) {
    return <SettingsView onBack={handleToggleSettings} />;
  }

  return (
    <>
      <Container>
        <ActionButtonsContainer>
          <ActionButton onClick={handleToggleSettings}>
            <FaCog size={24} />
          </ActionButton>
          <ActionButton onClick={handleToggleStats}>
            <FaChartBar size={24} />
          </ActionButton>
        </ActionButtonsContainer>
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