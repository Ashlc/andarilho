import { IAuthUser } from '@interfaces/IAuthUser';
import Admin from '@pages/Admin';
import Home from '@pages/Home';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const HomeController = () => {
  const { role } = useAuthUser() as IAuthUser;
  if (role === 'admin') {
    return <Admin />;
  } else return <Home />;
};

export default HomeController;
