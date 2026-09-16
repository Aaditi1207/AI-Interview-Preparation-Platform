import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppRouter from './router/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
