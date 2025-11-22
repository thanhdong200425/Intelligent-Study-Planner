interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  bgColor,
  iconColor,
}) => {
  return (
    <div className='bg-white p-5 rounded-xl shadow-sm flex items-center'>
      <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>{icon}</div>
      <div className='ml-4'>
        <p className='text-sm text-gray-500'>{title}</p>
        <p className='text-lg font-bold text-gray-800'>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
