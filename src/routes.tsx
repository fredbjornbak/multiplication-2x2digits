import BoxMethodMultiplication from './pages/BoxMethodMultiplication';
import BoxMethodIntroPage from './pages/BoxMethodIntroPage';

export const routes = [
  {
    path: '/',
    element: <BoxMethodIntroPage />,
  },
  {
    path: '/intro',
    element: <BoxMethodIntroPage />,
  },
  {
    path: '/box',
    element: <BoxMethodMultiplication />,
  },
];