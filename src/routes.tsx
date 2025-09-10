import BoxMethodMultiplication from './pages/BoxMethodMultiplication';
import BoxMethodIntroPage from './pages/BoxMethodIntroPage';
import InteractiveTutorialPage from './pages/InteractiveTutorialPage';

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
    path: '/tutorial',
    element: <InteractiveTutorialPage />,
  },
  {
    path: '/box',
    element: <BoxMethodMultiplication />,
  },
];