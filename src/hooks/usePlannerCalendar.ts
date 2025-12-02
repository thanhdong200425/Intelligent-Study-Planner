import { useMemo, useState } from 'react';
import { lastDayOfMonth } from 'date-fns';

interface Time {
  month: number;
  year: number;
}

interface GridDay {
  day: number;
  isOutside: boolean;
}

export const usePlannerCalendar = () => {
  const [currentMonthYear, setCurrentMonthYear] = useState<Time>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const currentDate = useMemo<Date>(() => new Date(), []);

  const grid = useMemo(
    () =>
      Array.from({ length: 5 }, () => Array.from({ length: 7 }, () => null)),
    []
  );

  const firstDayIndex = useMemo<number>(
    () =>
      new Date(currentMonthYear.year, currentMonthYear.month - 1, 1).getDay(),
    [currentMonthYear]
  );

  const lastDayInMonth = useMemo<number>(
    () =>
      lastDayOfMonth(
        new Date(currentMonthYear.year, currentMonthYear.month - 1, 1)
      ).getDate(),
    [currentMonthYear]
  );

  const gridDays = useMemo<GridDay[]>(() => {
    const prevMonth =
      currentMonthYear.month === 1 ? 12 : currentMonthYear.month - 1;
    const prevYear =
      currentMonthYear.month === 1
        ? currentMonthYear.year - 1
        : currentMonthYear.year;
    const prevLastDay = lastDayOfMonth(
      new Date(prevYear, prevMonth - 1, 1)
    ).getDate();

    return Array.from({ length: 35 }, (_, i) => {
      const relativeDay = i - firstDayIndex + 1;
      if (relativeDay < 1) {
        return { day: prevLastDay + relativeDay, isOutside: true };
      }
      if (relativeDay > lastDayInMonth) {
        return { day: relativeDay - lastDayInMonth, isOutside: true };
      }
      return { day: relativeDay, isOutside: false };
    });
  }, [currentMonthYear, firstDayIndex, lastDayInMonth]);

  const handleNextMonth = () => {
    if (currentMonthYear.month === 12) {
      setCurrentMonthYear({ month: 1, year: currentMonthYear.year + 1 });
      return;
    }
    setCurrentMonthYear({
      month: currentMonthYear.month + 1,
      year: currentMonthYear.year,
    });
  };

  const handlePreviousMonth = () => {
    if (currentMonthYear.month === 1) {
      setCurrentMonthYear({ month: 12, year: currentMonthYear.year - 1 });
      return;
    }
    setCurrentMonthYear({
      month: currentMonthYear.month - 1,
      year: currentMonthYear.year,
    });
  };

  const handleToday = () => {
    setCurrentMonthYear({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  return {
    currentMonthYear,
    currentDate,
    grid,
    gridDays,
    handleNextMonth,
    handlePreviousMonth,
    handleToday,
  };
};
