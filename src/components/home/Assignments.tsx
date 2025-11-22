import React from 'react';

const assignments = [
  {
    title: 'Colour Theory',
    date: '01 Sep 2022',
    grade: '86/100',
    status: 'completed',
  },
  {
    title: 'Design system',
    date: '01 Sep 2022',
    grade: '90/100',
    status: 'completed',
  },
  {
    title: 'User persona',
    date: '03 Sep 2022',
    grade: '0/100',
    status: 'todo',
  },
  { title: 'Prototyping', date: '06 Sep 2022', grade: '0/100', status: 'todo' },
];

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checked ? 'bg-black border-black' : 'border-gray-300'}`}
  >
    {checked && (
      <svg
        className='w-3 h-3 text-white'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='3'
          d='M5 13l4 4L19 7'
        ></path>
      </svg>
    )}
  </div>
);

const Assignments: React.FC = () => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-1'>
        Assignments (12)
      </h3>
      <p className='text-sm text-gray-500 mb-4'>2/5 completed</p>
      <div className='space-y-4'>
        {assignments.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center'>
              <CheckboxIcon checked={item.status === 'completed'} />
              <div className='ml-4'>
                <p className='font-semibold text-gray-800'>{item.title}</p>
                <p className='text-xs text-gray-500'>{item.date}</p>
              </div>
            </div>
            <div>
              <p
                className={`font-bold ${item.status === 'completed' ? 'text-gray-800' : 'text-gray-400'}`}
              >
                {item.grade}
              </p>
              <p
                className={`text-xs text-right ${item.status === 'completed' ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {item.status === 'completed' ? 'Grade' : 'To Do'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
