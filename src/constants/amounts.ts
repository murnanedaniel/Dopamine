/**
 * Constants for the amount options that can be selected in the AmountSpinner
 */
import { getAmountValues } from '../utils/settings';

/**
 * Get amount options based on contribution type
 * @param type - The type of contribution ('money' or 'time')
 * @returns Array of amount options
 */
export const getAmountsByType = (type: 'money' | 'time'): number[] => {
  return getAmountValues(type);
}; 