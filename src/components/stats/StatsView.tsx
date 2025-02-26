import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaMoneyBillWave, 
  FaClock, 
  FaChartBar, 
  FaArrowLeft, 
  FaSync, 
  FaHandHoldingUsd,
  FaHourglassHalf
} from 'react-icons/fa';
import { 
  getContributions, 
  getTotalContributionsByType, 
  resetGoalContributions,
  getNetContributionForGoal,
  withdrawFromGoal
} from '../../utils/storage';
import { Goal } from '../rewards/GoalWheel';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const StatIcon = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme, color }) => color || theme.colors.accent};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  margin-right: ${({ theme }) => theme.spacing.lg};
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, active }) => active ? theme.colors.accent : 'transparent'};
  color: ${({ theme, active }) => active ? 'white' : theme.colors.text.primary};
  border: none;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, active }) => active ? theme.colors.accent : theme.colors.surface};
  }
`;

const GoalsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GoalCard = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const GoalInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const GoalName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const GoalStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const GoalStat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const GoalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: rgba(0, 184, 148, 0.1);
  }
  
  &.reset:hover {
    color: ${({ theme }) => theme.colors.warning};
    background: rgba(253, 203, 110, 0.1);
  }
  
  &.withdraw:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(45, 52, 54, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: transparent;
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ModalContent = styled.div`
  width: 90%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalButton = styled.button<{ danger?: boolean; primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, danger, primary }) => 
    danger ? theme.colors.error : 
    primary ? theme.colors.accent : 
    'transparent'};
  color: ${({ theme, danger, primary }) => 
    danger || primary ? 'white' : theme.colors.text.primary};
  border: ${({ theme, danger, primary }) => 
    danger || primary ? 'none' : `1px solid ${theme.colors.text.secondary}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const WithdrawOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const WithdrawOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const WithdrawLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const WithdrawInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  width: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const WithdrawError = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SuccessMessage = styled(motion.div)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: 10;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface StatsViewProps {
  onBack: () => void;
}

type ModalType = 'reset' | 'withdraw' | null;

interface ModalState {
  type: ModalType;
  goalId: string;
  goalName: string;
}

export const StatsView: React.FC<StatsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'goals'>('summary');
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [goalStats, setGoalStats] = useState<Record<string, { name: string, money: number, time: number }>>({});
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [withdrawType, setWithdrawType] = useState<'money' | 'time'>('money');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  
  const loadData = useCallback(() => {
    // Get total contributions
    const money = getTotalContributionsByType('money');
    const time = getTotalContributionsByType('time');
    setTotalMoney(money);
    setTotalTime(time);
    
    // Get contributions by goal
    const contributions = getContributions();
    const stats: Record<string, { name: string, money: number, time: number }> = {};
    
    // Create a unique set of goals
    const uniqueGoals = new Set<string>();
    contributions.forEach(contribution => uniqueGoals.add(contribution.goalId));
    
    // Calculate net amounts for each goal
    uniqueGoals.forEach(goalId => {
      const goalContributions = contributions.filter(c => c.goalId === goalId);
      if (goalContributions.length === 0) return;
      
      const goalName = goalContributions[0].goalName;
      const money = getNetContributionForGoal(goalId, 'money');
      const time = getNetContributionForGoal(goalId, 'time');
      
      stats[goalId] = { name: goalName, money, time };
    });
    
    setGoalStats(stats);
  }, []);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleResetGoal = useCallback((id: string, name: string) => {
    setModalState({ type: 'reset', goalId: id, goalName: name });
  }, []);
  
  const handleWithdrawFromGoal = useCallback((id: string, name: string) => {
    setModalState({ type: 'withdraw', goalId: id, goalName: name });
    setWithdrawType('money');
    setWithdrawAmount(0);
    setWithdrawError(null);
  }, []);
  
  const handleConfirmReset = useCallback(() => {
    if (!modalState || modalState.type !== 'reset') return;
    
    resetGoalContributions(modalState.goalId, modalState.goalName);
    setModalState(null);
    loadData();
    setShowSuccess(`Reset ${modalState.goalName} successfully!`);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(null);
    }, 3000);
  }, [modalState, loadData]);
  
  const handleConfirmWithdraw = useCallback(() => {
    if (!modalState || modalState.type !== 'withdraw') return;
    
    // Validate withdrawal amount
    if (withdrawAmount <= 0) {
      setWithdrawError('Amount must be greater than 0');
      return;
    }
    
    const availableAmount = goalStats[modalState.goalId][withdrawType];
    if (withdrawAmount > availableAmount) {
      setWithdrawError(`Cannot withdraw more than available (${availableAmount})`);
      return;
    }
    
    // Process withdrawal
    withdrawFromGoal(modalState.goalId, modalState.goalName, withdrawType, withdrawAmount);
    setModalState(null);
    loadData();
    setShowSuccess(`Withdrew ${withdrawType === 'money' ? '$' : ''}${withdrawAmount}${withdrawType === 'time' ? ' minutes' : ''} from ${modalState.goalName}!`);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(null);
    }, 3000);
  }, [modalState, withdrawType, withdrawAmount, goalStats, loadData]);
  
  const handleCancelModal = useCallback(() => {
    setModalState(null);
    setWithdrawError(null);
  }, []);
  
  const handleWithdrawTypeChange = useCallback((type: 'money' | 'time') => {
    setWithdrawType(type);
    setWithdrawAmount(0);
    setWithdrawError(null);
  }, []);
  
  const handleWithdrawAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) return;
    setWithdrawAmount(value);
    setWithdrawError(null);
  }, []);
  
  const renderSummary = () => (
    <StatsContainer>
      <StatCard>
        <StatIcon color="#4CAF50">
          <FaMoneyBillWave />
        </StatIcon>
        <StatContent>
          <StatValue>${totalMoney}</StatValue>
          <StatLabel>Total Money Contributed</StatLabel>
        </StatContent>
      </StatCard>
      
      <StatCard>
        <StatIcon color="#2196F3">
          <FaClock />
        </StatIcon>
        <StatContent>
          <StatValue>{totalTime} minutes</StatValue>
          <StatLabel>Total Time Contributed</StatLabel>
        </StatContent>
      </StatCard>
      
      <StatCard>
        <StatIcon color="#9C27B0">
          <FaChartBar />
        </StatIcon>
        <StatContent>
          <StatValue>{Object.keys(goalStats).length}</StatValue>
          <StatLabel>Goals Funded</StatLabel>
        </StatContent>
      </StatCard>
    </StatsContainer>
  );
  
  const renderGoals = () => {
    const goals = Object.entries(goalStats);
    
    if (goals.length === 0) {
      return (
        <EmptyState>
          <h3>No contributions yet</h3>
          <p>Start rolling the dice to earn rewards!</p>
        </EmptyState>
      );
    }
    
    return (
      <GoalsList>
        {goals.map(([id, stats]) => (
          <GoalCard key={id}>
            <GoalInfo>
              <GoalName>{stats.name}</GoalName>
              <GoalStats>
                {stats.money > 0 && (
                  <GoalStat>
                    <FaMoneyBillWave />
                    ${stats.money}
                  </GoalStat>
                )}
                {stats.time > 0 && (
                  <GoalStat>
                    <FaClock />
                    {stats.time} minutes
                  </GoalStat>
                )}
              </GoalStats>
            </GoalInfo>
            <GoalActions>
              <ActionButton 
                className="withdraw"
                onClick={() => handleWithdrawFromGoal(id, stats.name)}
                disabled={stats.money === 0 && stats.time === 0}
                title="Withdraw"
              >
                <FaHandHoldingUsd />
              </ActionButton>
              <ActionButton 
                className="reset"
                onClick={() => handleResetGoal(id, stats.name)}
                disabled={stats.money === 0 && stats.time === 0}
                title="Reset"
              >
                <FaSync />
              </ActionButton>
            </GoalActions>
          </GoalCard>
        ))}
      </GoalsList>
    );
  };
  
  const renderModal = () => {
    if (!modalState) return null;
    
    if (modalState.type === 'reset') {
      return (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Reset Goal</ModalTitle>
            <ModalText>
              Are you sure you want to reset all contributions for "{modalState.goalName}"? 
              This will set all values to zero.
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={handleCancelModal}>Cancel</ModalButton>
              <ModalButton danger onClick={handleConfirmReset}>Reset</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      );
    }
    
    if (modalState.type === 'withdraw') {
      const goalData = goalStats[modalState.goalId];
      const hasMoney = goalData && goalData.money > 0;
      const hasTime = goalData && goalData.time > 0;
      
      return (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Withdraw from {modalState.goalName}</ModalTitle>
            <ModalText>
              Select what you'd like to withdraw:
            </ModalText>
            
            <WithdrawOptions>
              <WithdrawOption>
                <WithdrawLabel>
                  <input 
                    type="radio" 
                    name="withdrawType" 
                    checked={withdrawType === 'money'} 
                    onChange={() => handleWithdrawTypeChange('money')}
                    disabled={!hasMoney}
                  />
                  <FaMoneyBillWave /> Money (${goalData?.money || 0} available)
                </WithdrawLabel>
              </WithdrawOption>
              
              <WithdrawOption>
                <WithdrawLabel>
                  <input 
                    type="radio" 
                    name="withdrawType" 
                    checked={withdrawType === 'time'} 
                    onChange={() => handleWithdrawTypeChange('time')}
                    disabled={!hasTime}
                  />
                  <FaHourglassHalf /> Time ({goalData?.time || 0} minutes available)
                </WithdrawLabel>
              </WithdrawOption>
              
              <WithdrawOption>
                <WithdrawLabel htmlFor="withdrawAmount">
                  Amount:
                </WithdrawLabel>
                <WithdrawInput
                  id="withdrawAmount"
                  type="number"
                  min="1"
                  max={goalData?.[withdrawType] || 0}
                  value={withdrawAmount || ''}
                  onChange={handleWithdrawAmountChange}
                />
              </WithdrawOption>
              
              {withdrawError && (
                <WithdrawError>{withdrawError}</WithdrawError>
              )}
            </WithdrawOptions>
            
            <ModalButtons>
              <ModalButton onClick={handleCancelModal}>Cancel</ModalButton>
              <ModalButton 
                primary 
                onClick={handleConfirmWithdraw}
                disabled={!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > (goalData?.[withdrawType] || 0)}
              >
                Withdraw
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      );
    }
    
    return null;
  };
  
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <BackButton onClick={onBack}>
          <FaArrowLeft />
          Back
        </BackButton>
        <Title>Your Stats</Title>
      </Header>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'summary'} 
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </Tab>
        <Tab 
          active={activeTab === 'goals'} 
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </Tab>
      </TabContainer>
      
      {activeTab === 'summary' ? renderSummary() : renderGoals()}
      
      {renderModal()}
      
      {showSuccess && (
        <SuccessMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {showSuccess}
        </SuccessMessage>
      )}
    </Container>
  );
}; 