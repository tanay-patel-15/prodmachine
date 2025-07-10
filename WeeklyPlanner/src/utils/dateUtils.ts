export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateWeek = (startDate: Date): { days: Array<{ id: string; date: string; dayName: string; tasks: any[] }>; startDate: string; endDate: string; id: string } => {
  const days: Array<{ id: string; date: string; dayName: string; tasks: any[] }> = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    days.push({
      id: `day-${i}-${getDateString(currentDate)}`,
      date: getDateString(currentDate),
      dayName: getDayName(currentDate),
      tasks: []
    });
  }
  
  const endDate = new Date(start);
  endDate.setDate(start.getDate() + 6);
  
  return {
    id: `week-${getDateString(start)}`,
    startDate: getDateString(start),
    endDate: getDateString(endDate),
    days
  };
};

export const getCurrentWeekStart = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  return startOfWeek;
};

export const formatWeekRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  } else {
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
  }
}; 