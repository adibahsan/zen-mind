export const secondsToMinutesAndSeconds = (totalSeconds: number): { minutes: string; seconds: string } => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return {
    minutes: minutes.toString(),
    seconds: seconds.toString().padStart(2, '0')
  };
};

export const minutesToHoursAndMinutes = (totalMinutes: number): { hours: number; minutes: number } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes };
};

export const formatDuration = (minutes: number): string => {
  const { hours, minutes: mins } = minutesToHoursAndMinutes(minutes);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${mins}m`;
};