import Image from 'next/image';

export default function BrandLogo({
  src = '/studygo-high-resolution-logo-transparent.png',
  width = 120,
  height = 48,
}: {
  src?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className='flex justify-center mb-6'>
      <Image
        src={src}
        alt='StudyGo'
        width={width}
        height={height}
        className='h-12 w-auto'
        priority
      />
    </div>
  );
}
