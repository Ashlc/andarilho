import { Input } from '@components/ui/input';
import { RiSearch2Line } from 'react-icons/ri';

const Index = ({
  placeholder = 'Pesquisar',
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}) => {
  return (
    <div className="relative grow">
      <RiSearch2Line size={14} className="absolute left-2 top-3 h-4 w-4" />
      <Input
        placeholder={placeholder}
        className="pl-8 border-border"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default Index;
