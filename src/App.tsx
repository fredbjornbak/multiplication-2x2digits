import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from './routes';
import FontProvider from './components/FontProvider';
import './i18n'; // Import i18n configuration (English only)

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    children: routes,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FontProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </FontProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
