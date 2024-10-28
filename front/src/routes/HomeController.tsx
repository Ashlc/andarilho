import Admin from '@pages/Admin';
import Home from '@pages/Home';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

type Props = {};

const HomeController = (props: Props) => {
  const { role } = useAuthUser();
  if (role === 'admin') {
    return <Admin />;
  } else return <Home />;
};

export default HomeController;
