"use client";
import { Button, Card } from '@heroui/react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { BaseButton } from '../buttons';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

interface Time {
    month: number;
    year: number;
}

export function PlannerCalendar() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [currentMonthYear, setCurrentMonthYear] = useState<Time>({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
    const currentDate = useMemo<Date>(
        () => new Date(), []
    )
    const grid = Array.from({ length: 5 }, () => Array.from({ length: 7 }, () => null));

    const handleNextMonth = () => {
        if (currentMonthYear.month === 12) {
            setCurrentMonthYear({ month: 1, year: currentMonthYear.year + 1 })
            return;
        }
        setCurrentMonthYear({ month: currentMonthYear.month + 1, year: currentMonthYear.year })
    }

    const handlePreviousMonth = () => {
        if (currentMonthYear.month === 1) {
            setCurrentMonthYear({ month: 12, year: currentMonthYear.year - 1 })
            return;
        }
        setCurrentMonthYear({ month: currentMonthYear.month - 1, year: currentMonthYear.year })
    }

    const handleToday = () => {
        setCurrentMonthYear({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
    }

    console.log(currentDate)

    return (
        <Card className="p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-base text-gray-900">{format(new Date(currentMonthYear.year, currentMonthYear.month - 1, 1), 'MMMM yyyy')}</h2>
                <div className="flex items-center gap-2">
                    {currentMonthYear.month !== currentDate.getMonth() + 1 || currentMonthYear.year !== currentDate.getFullYear() ? (
                        <Button isIconOnly variant="bordered" radius="sm" aria-label="today" onPress={handleToday}>
                            <Calendar className="size-4" />
                        </Button>
                    ) : null}
                    <Button isIconOnly variant="bordered" radius="sm" aria-label="prev" onPress={handlePreviousMonth}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button isIconOnly variant="bordered" radius="sm" aria-label="next" onPress={handleNextMonth}>
                        <ChevronRight className="size-4" />
                    </Button>
                    <BaseButton startContent={<Plus className="size-4" />} content="Add Event" />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-7 text-center text-sm text-gray-500">
                {days.map((d) => (
                    <div key={d} className="py-2">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-2 mt-2 flex-1 min-h-0">
                {grid.flatMap((row, r) =>
                    row.map((_, c) => (
                        <div key={`${r}-${c}`} className="border border-gray-200 rounded-lg p-2 h-full text-sm text-gray-700">
                            {/* static demo numbers matching Figma row 1 starts Thu: show a few highlights */}
                            {r === 0 && c < 4 ? '' : r * 7 + c - 2}
                            {r === 0 && c === 4 && (
                                <div className="mt-2 bg-blue-600 text-white text-xs rounded px-1 py-0.5">UI Design</div>
                            )}
                            {r === 0 && c === 5 && (
                                <div className="mt-2 bg-red-600 text-white text-xs rounded px-1 py-0.5">Math Exam</div>
                            )}
                            {r === 0 && c === 6 && (
                                <div className="mt-2 bg-amber-500 text-white text-xs rounded px-1 py-0.5">Research Paper</div>
                            )}
                            {r === 2 && c === 1 && (
                                <div className="mt-2 bg-blue-600 text-white text-xs rounded px-1 py-0.5">Study Group</div>
                            )}
                            {r === 3 && c === 2 && (
                                <div className="mt-2 bg-red-600 text-white text-xs rounded px-1 py-0.5">Physics Test</div>
                            )}
                        </div>
                    )),
                )}
            </div>
            <div className="flex items-center gap-6 border-t border-gray-100 pt-3 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2"><span className="size-3 rounded bg-blue-600 inline-block" /> Study Session</div>
                <div className="flex items-center gap-2"><span className="size-3 rounded bg-red-600 inline-block" /> Exam</div>
                <div className="flex items-center gap-2"><span className="size-3 rounded bg-amber-500 inline-block" /> Assignment</div>
            </div>
        </Card>
    );
}


