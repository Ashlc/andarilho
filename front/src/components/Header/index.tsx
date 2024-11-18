import Andarilho from '@assets/Andarilho.svg';
import { Button } from '@components/ui/button';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate('/login');
  };
  return (
    <div className="sm:w-screen md:w-10/12 mx-auto md:sticky z-20 top-0 py-4 max-md:hidden">
      <div className="w-full bg-background h-[48px] flex flex-row items-center px-6 rounded-lg border border-b-black select-none justify-between">
        <img src={Andarilho} alt="Logo Andarilho" className="h-4" />
        <Button variant="ghost" size="sm" onClick={logout} className="gap-1">
          <RiLogoutBoxLine size={18} />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Index;
