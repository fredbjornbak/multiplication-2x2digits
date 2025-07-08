import BoxMethodMultiplication from './pages/BoxMethodMultiplication';
import Dashboard from './pages/Dashboard';

export const routes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/box',
    element: <BoxMethodMultiplication />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
];