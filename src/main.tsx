import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import PassaloportPage from './pages/PassaloportPage.tsx';
import PassaloportAppPage from './pages/PassaloportAppPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SchedulePage from './pages/SchedulePage.tsx';
import CamisetaPage from './pages/CamisetaPage.tsx';
import { AdminGuard } from './components/AdminGuard.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/passaloport',
    element: <PassaloportPage />,
  },
  {
    path: '/passaloport/app',
    element: <PassaloportAppPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/cronograma',
    element: <SchedulePage />,
  },
  {
    path: '/camiseta',
    element: <CamisetaPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminPage />
      </AdminGuard>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ToastProvider>
  </StrictMode>,
);
