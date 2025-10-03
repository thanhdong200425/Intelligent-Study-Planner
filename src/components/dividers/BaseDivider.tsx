import { Divider } from '@heroui/react';

const BaseDivider = () => {
  return (
    <div className='flex w-full items-center gap-3 py-2'>
      <Divider className='flex-1' />
      <span className='text-xs text-slate-500'>OR</span>
      <Divider className='flex-1' />
    </div>
  );
};

export default BaseDivider;
