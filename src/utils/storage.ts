import { ContributionType } from '../components/rewards/ContributionTypeSelector';

interface Contribution {
  goalId: string;
  goalName: string;
  type: ContributionType;
  amount: number;
  timestamp: number;
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
    .reduce((total, contribution) => total + contribution.amount, 0);
}; 