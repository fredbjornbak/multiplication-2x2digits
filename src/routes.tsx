import BoxMethodMultiplication from './pages/BoxMethodMultiplication';
import BoxMethodIntroPage from './pages/BoxMethodIntroPage';
import BoxMethodIntro2Page from './pages/BoxMethodIntro2Page';
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
    path: '/intro2',
    element: <BoxMethodIntro2Page />,
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