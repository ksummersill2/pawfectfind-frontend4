export const formatDogAge = (age: number): string => {
  if (age < 1) {
    const months = Math.round(age * 12);
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  return `${age} year${age === 1 ? '' : 's'}`;
};

export const formatDogWeight = (weight: number, unit: 'kg' | 'lbs' = 'kg'): string => {
  if (unit === 'lbs') {
    return `${(weight * 2.20462).toFixed(1)} lbs`;
  }
  return `${weight.toFixed(1)} kg`;
};

export const formatActivityLevel = (level: number): string => {
  const labels = [
    'Very Low',
    'Low',
    'Moderate Low',
    'Moderate',
    'Moderate High',
    'High',
    'Very High',
    'Extremely High',
    'Super Active',
    'Ultra Active'
  ];
  return labels[Math.min(Math.floor(level) - 1, labels.length - 1)];
};