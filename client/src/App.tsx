import AppRouter from './app/router';
import ToastContainer from './components/ui/ToastContainer';
import { useAuthBootstrap } from './features/auth/hooks/useAuthBootstrap';

function App() {
  useAuthBootstrap();

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;