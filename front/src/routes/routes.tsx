import Account from '@pages/Account';
import Home from '@pages/Home';
import Landing from '@pages/Landing';
import Login from '@pages/Login';
import MyReports from '@pages/MyReports';
import Report from '@pages/Report';
import SignUp from '@pages/SignUp';
import ViewReport from '@pages/ViewReport';
import { createBrowserRouter } from 'react-router-dom';
import PrivateLayout from '../layouts/PrivateLayout';
import HomeController from './HomeController';

export const AppRoutes = createBrowserRouter([
  {
    element: <PrivateLayout />,
    children: [
      { path: '/home', element: <HomeController /> },
      { path: '/reporte/:id', element: <ViewReport /> },
      { path: '/reporte', element: <Report /> },
      { path: '/meus-reportes', element: <MyReports /> },
      { path: '/conta', element: <Account /> },
    ],
  },
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/cadastro', element: <SignUp /> },
]);

export default AppRoutes;
