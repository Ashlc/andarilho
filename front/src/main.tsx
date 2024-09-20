import { QueryClientProvider } from '@tanstack/react-query';
import { qc } from '@utils/queryClient';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AppRoutes from 'routes/routes';
import { Toaster } from 'sonner';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      {/* <GeolocationProvider> */}
      <Toaster />
      <RouterProvider router={AppRoutes} />
      {/* </GeolocationProvider> */}
    </QueryClientProvider>
  </StrictMode>,
);
