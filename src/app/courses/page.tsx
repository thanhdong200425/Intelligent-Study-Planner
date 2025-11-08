'use client';

import React, { useMemo, useState } from 'react';
import { SidebarNav, HeaderBar } from '@/components';
import { AddCourseForm, CourseCard } from '@/components/courses';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/services/courseApi';
import { BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  console.log('Fetched courses: ', JSON.stringify(courses, null, 2));

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <HeaderBar
          title='My Courses'
          description='Manage your enrolled courses'
        />

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto p-8 pt-8'>
          <div className='flex flex-col gap-8 max-w-7xl'>
            {/* Add Course Form */}
            <AddCourseForm />

            {/* Your Courses Section */}
            <div className='flex flex-col gap-1'>
              <h2 className='text-base font-normal text-gray-900 leading-6'>
                Your Courses
              </h2>
              <p className='text-sm text-gray-500 leading-5'>
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? 's' : ''} enrolled
              </p>
            </div>

            {/* Course Cards Grid */}
            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-gray-500'>Loading courses...</div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 gap-4'>
                <BookOpen className='w-12 h-12 text-gray-300' />
                <div className='text-center'>
                  <p className='text-gray-900 font-medium mb-1'>
                    {searchQuery ? 'No courses found' : 'No courses yet'}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {searchQuery
                      ? 'Try adjusting your search'
                      : 'Add your first course to get started'}
                  </p>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredCourses.map(course => (
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
