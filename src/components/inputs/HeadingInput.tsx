interface HeadingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  className?: string;
  errorMessage?: string;
  isInvalid?: boolean;
}
const HeadingInput: React.FC<HeadingInputProps> = ({
  placeholder,
  className,
  errorMessage,
  isInvalid,
  ...field
}) => {
  const baseClasses =
    'font-semibold w-full border-none p-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent';
  return (
    <div className='flex flex-col gap-[9px]'>
      <input
        type='text'
        placeholder={placeholder}
        className={`${baseClasses} ${className || ''}`}
        {...field}
      />
      {errorMessage && <p className='text-sm text-red-600'>{errorMessage}</p>}
    </div>
  );
};

export default HeadingInput;
