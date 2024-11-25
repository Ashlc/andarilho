import { MdAccessibleForward, MdBlind } from 'react-icons/md';
import { RiLoader2Line } from 'react-icons/ri';

type Props = {
  type?: 'RAMP' | 'blind';
};

const Index = ({ type }: Props) => {
  const reportTypes = {
    RAMP: <MdAccessibleForward size={24} />,
    blind: <MdBlind size={24} />,
    tactile_paving: <MdBlind size={24} />,
    braille_signs: <MdBlind size={24} />,
    braille_auditory_adaptations: <MdBlind size={24} />,
    reserved_parking: <MdAccessibleForward size={24} />,
    bathroom_adaptations: <MdAccessibleForward size={24} />,
  };
  return (
    <div className="w-16 rounded-lg aspect-square flex flex-col items-center justify-center bg-black text-white">
      {type ? (
        reportTypes[type]
      ) : (
        <RiLoader2Line size={24} className="animate-spin" />
      )}
    </div>
  );
};

export default Index;
