import { ContributionType } from '../components/rewards/ContributionTypeSelector';

interface Contribution {
  goalId: string;
  goalName: string;
  type: ContributionType;
  amount: number;
  timestamp: number;
  isWithdrawal?: boolean;
}

const STORAGE_KEY = 'dopamine_contributions';

export const saveContribution = (contribution: Omit<Contribution, 'timestamp'>) => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const contributions: Contribution[] = existingData ? JSON.parse(existingData) : [];
    
    contributions.push({
      ...contribution,
      timestamp: Date.now()
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributions));
    return true;
  } catch (error) {
    console.error('Failed to save contribution:', error);
    return false;
  }
};

export const getContributions = (): Contribution[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get contributions:', error);
    return [];
  }
};

export const getContributionsByGoal = (goalId: string): Contribution[] => {
  const contributions = getContributions();
  return contributions.filter(contribution => contribution.goalId === goalId);
};

export const getTotalContributionsByType = (type: ContributionType): number => {
  const contributions = getContributions();
  return contributions
    .filter(contribution => contribution.type === type)
    .reduce((total, contribution) => {
      const amount = contribution.isWithdrawal ? -contribution.amount : contribution.amount;
      return total + amount;
    }, 0);
};

/**
 * Get net contributions for a specific goal by type
 * @param goalId - The ID of the goal
 * @param type - The type of contribution ('money' or 'time')
 * @returns Net contribution amount
 */
export const getNetContributionForGoal = (goalId: string, type: ContributionType): number => {
  const contributions = getContributionsByGoal(goalId);
  return contributions
    .filter(contribution => contribution.type === type)
    .reduce((total, contribution) => {
      const amount = contribution.isWithdrawal ? -contribution.amount : contribution.amount;
      return total + amount;
    }, 0);
};

/**
 * Withdraw from a goal
 * @param goalId - The ID of the goal
 * @param goalName - The name of the goal
 * @param type - The type of contribution ('money' or 'time')
 * @param amount - The amount to withdraw
 * @returns boolean indicating success
 */
export const withdrawFromGoal = (
  goalId: string, 
  goalName: string, 
  type: ContributionType, 
  amount: number
): boolean => {
  try {
    // Check if there's enough to withdraw
    const available = getNetContributionForGoal(goalId, type);
    if (available < amount) {
      return false;
    }
    
    // Save as a negative contribution
    return saveContribution({
      goalId,
      goalName,
      type,
      amount,
      isWithdrawal: true
    });
  } catch (error) {
    console.error('Failed to withdraw from goal:', error);
    return false;
  }
};

/**
 * Reset all contributions for a specific goal
 * @param goalId - The ID of the goal
 * @param goalName - The name of the goal
 * @returns boolean indicating success
 */
export const resetGoalContributions = (goalId: string, goalName: string): boolean => {
  try {
    const contributions = getContributions();
    
    // Get current net amounts for the goal
    const moneyAmount = getNetContributionForGoal(goalId, 'money');
    const timeAmount = getNetContributionForGoal(goalId, 'time');
    
    // Add withdrawal entries to zero out the goal
    if (moneyAmount > 0) {
      contributions.push({
        goalId,
        goalName,
        type: 'money',
        amount: moneyAmount,
        timestamp: Date.now(),
        isWithdrawal: true
      });
    }
    
    if (timeAmount > 0) {
      contributions.push({
        goalId,
        goalName,
        type: 'time',
        amount: timeAmount,
        timestamp: Date.now(),
        isWithdrawal: true
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributions));
    return true;
  } catch (error) {
    console.error('Failed to reset goal contributions:', error);
    return false;
  }
}; 