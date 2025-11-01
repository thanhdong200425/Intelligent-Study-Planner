'use client';

import React, { useMemo, useState } from 'react';
import { SidebarNav, HeaderBar } from '@/components';
import { AddCourseForm, CourseCard } from '@/components/courses';
import { useQuery } from '@tanstack/react-query';
import { CourseApiService } from '@/services/courseApi';
import { Course } from '@/types';
import { Input } from '@heroui/react';
import { Search, BookOpen, Clock } from 'lucide-react';

// Mock data for hours and progress - in real app, these would come from the backend
const getCourseStats = (courseId: number): { hours: number; progress: number } => {
    // Mock data based on course ID for demonstration
    const mockData: { [key: number]: { hours: number; progress: number } } = {
        1: { hours: 48, progress: 67 },
        2: { hours: 64, progress: 70 },
        3: { hours: 40, progress: 70 },
        4: { hours: 36, progress: 100 },
        5: { hours: 30, progress: 0 },
        6: { hours: 25, progress: 0 },
    };
    return mockData[courseId] || { hours: 0, progress: 0 };
};

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: CourseApiService.getCourses,
    });

    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) return courses;
        return courses.filter((course) =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courses, searchQuery]);

    const coursesWithStats: (Course & { hours: number; progress: number })[] =
        filteredCourses.map((course) => ({
            ...course,
            ...getCourseStats(course.id),
        }));

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SidebarNav />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Custom Header */}
                <header className="bg-white border-b border-gray-200 px-8 pt-4 pb-1">
                    <div className="flex items-center justify-between h-12 mb-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-base font-normal text-gray-900 leading-6">
                                My Courses
                            </h1>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-500 leading-5">
                                    Manage your enrolled courses
                                </p>
                            </div>
                        </div>
                        <div className="relative w-[292px]">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <Input
                                placeholder="Search courses..."
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                classNames={{
                                    base: 'h-[38px]',
                                    input: 'pl-10 text-sm',
                                    inputWrapper: 'border border-gray-200 rounded-[10px]',
                                }}
                                variant="bordered"
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 pt-8">
                    <div className="flex flex-col gap-8 max-w-7xl">
                        {/* Add Course Form */}
                        <AddCourseForm />

                        {/* Your Courses Section */}
                        <div className="flex flex-col gap-1">
                            <h2 className="text-base font-normal text-gray-900 leading-6">
                                Your Courses
                            </h2>
                            <p className="text-sm text-gray-500 leading-5">
                                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} enrolled
                            </p>
                        </div>

                        {/* Course Cards Grid */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-gray-500">Loading courses...</div>
                            </div>
                        ) : coursesWithStats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <BookOpen className="w-12 h-12 text-gray-300" />
                                <div className="text-center">
                                    <p className="text-gray-900 font-medium mb-1">
                                        {searchQuery ? 'No courses found' : 'No courses yet'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {searchQuery
                                            ? 'Try adjusting your search'
                                            : 'Add your first course to get started'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {coursesWithStats.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
