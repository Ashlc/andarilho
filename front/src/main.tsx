import { QueryClientProvider } from '@tanstack/react-query';
import { qc } from '@utils/queryClient';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AppRoutes from 'routes/routes';
import { Toaster } from 'sonner';
import './index.css';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

createRoot(document.getElementById('root')!).render(
  <AuthProvider store={store}>
    <QueryClientProvider client={qc}>
      <Toaster position="bottom-center" />
      <RouterProvider router={AppRoutes} />
      {/* </GeolocationProvider> */}
    </QueryClientProvider>
  </AuthProvider>,
);
