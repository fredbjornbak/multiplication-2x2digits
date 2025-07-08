import Onboarding from './pages/Onboarding';
import MainScreen from './pages/MainScreen';
import BasicMultiplication from './pages/BasicMultiplication';
import BoxMethodMultiplication from './pages/BoxMethodMultiplication';
import NotFound from './pages/NotFound';

export const routes = [
  {
    path: '/',
    element: <MainScreen />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/basic',
    element: <BasicMultiplication />,
  },
  {
    path: '/box',
    element: <BoxMethodMultiplication />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 