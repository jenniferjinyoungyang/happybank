const memoryDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export const formatMemoryDate = (value: string | Date): string => {
  const dateObj = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(dateObj.getTime())) {
    return 'Unknown date';
  }

  return memoryDateFormatter.format(dateObj);
};
