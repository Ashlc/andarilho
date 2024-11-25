import { statusColors } from '@utils/statusColors';

type Props = {
  status: 'PENDING' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED';
  size?: 'dot' | 'default';
  className?: string;
};

const index = ({ status, className, size = 'default' }: Props) => {
  const statusTranslation = {
    PENDING: 'Pendente',
    IN_REVIEW: 'Em análise',
    IN_PROGRESS: 'Em andamento',
    RESOLVED: 'Finalizado',
  };
  return (
    <div
      className={`border ${size === 'default' ? 'px-4 py-1 w-fit' : 'w-4 h-4'} rounded-full font-medium text-xs ${statusColors[status].background} ${statusColors[status].text} ${statusColors[status].border} ${className}`}
    >
      {size === 'default' && statusTranslation[status]}
    </div>
  );
};

export default index;
