import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getVerdictColor = (verdict: string): string => {
  switch (verdict) {
    case 'ALLOW':
      return 'text-green-400';
    case 'NEEDS_FIX':
      return 'text-amber-400';
    case 'BLOCK':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
};

export const getVerdictIcon = (verdict: string) => {
  switch (verdict) {
    case 'ALLOW':
      return '✅';
    case 'NEEDS_FIX':
      return '⚠️';
    case 'BLOCK':
      return '🚫';
    default:
      return '❓';
  }
};
