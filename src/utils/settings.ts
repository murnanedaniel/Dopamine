/**
 * Settings utility for storing and retrieving user settings
 */

const SETTINGS_KEY = 'dopamine_settings';

export interface AmountSettings {
  moneyMin: number;
  moneyMax: number;
  timeMin: number;
  timeMax: number;
}

// Default settings
export const DEFAULT_SETTINGS: AmountSettings = {
  moneyMin: 1,
  moneyMax: 100,
  timeMin: 1,
  timeMax: 120
};

/**
 * Generate logarithmically distributed values between min and max
 * @param min Minimum value
 * @param max Maximum value
 * @param count Number of values to generate
 * @returns Array of logarithmically distributed values
 */
export const generateLogValues = (min: number, max: number, count: number): number[] => {
  if (min <= 0) min = 1; // Ensure min is positive for log calculation
  
  const values: number[] = [];
  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  const step = (maxLog - minLog) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const logValue = minLog + (step * i);
    const value = Math.round(Math.exp(logValue));
    
    // Avoid duplicates
    if (values.length === 0 || values[values.length - 1] !== value) {
      values.push(value);
    }
  }
  
  // Ensure min and max are included
  if (values[0] !== min) values[0] = min;
  if (values[values.length - 1] !== max) values[values.length - 1] = max;
  
  return values;
};

/**
 * Save settings to localStorage
 * @param settings Settings to save
 * @returns boolean indicating success
 */
export const saveSettings = (settings: AmountSettings): boolean => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

/**
 * Get settings from localStorage
 * @returns Settings object
 */
export const getSettings = (): AmountSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Get amount values based on settings
 * @param type Type of amount ('money' or 'time')
 * @returns Array of amount values
 */
export const getAmountValues = (type: 'money' | 'time'): number[] => {
  const settings = getSettings();
  const count = 30; // Number of values to generate
  
  if (type === 'money') {
    return generateLogValues(settings.moneyMin, settings.moneyMax, count);
  } else {
    return generateLogValues(settings.timeMin, settings.timeMax, count);
  }
}; 