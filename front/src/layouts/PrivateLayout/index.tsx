import RequireAuth from '@auth-kit/react-router/RequireAuth';
import { Outlet } from 'react-router-dom';
import PageLayout from '../PageLayout';

// type Props = {
//     children: ReactNode
// }

const index = () => (
  <RequireAuth fallbackPath="/login">
    <PageLayout>
      <Outlet />
    </PageLayout>
  </RequireAuth>
);

export default index;
