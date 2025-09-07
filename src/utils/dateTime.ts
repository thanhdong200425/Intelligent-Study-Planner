export const formatTime = (value: number) => {
  if (value < 10) return '0' + value;
  return value;
};

export const toSeconds = ({
  hours = 0,
  minutes,
  seconds,
}: {
  hours?: number;
  minutes: number;
  seconds: number;
}) => {
  return hours * 3600 + minutes * 60 + seconds;
};

export const fromSeconds = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
};
