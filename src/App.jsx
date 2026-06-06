import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Recommendations from './pages/Recommendations';
import MovieDetails from './pages/MovieDetails';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Login from './pages/Login';

// Auth pages don't show the Navbar
const AUTH_ROUTES = ['/login'];

// Page transition wrapper
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/recommendations" element={<PageWrapper><Recommendations /></PageWrapper>} />
          <Route path="/movie/:id" element={<PageWrapper><MovieDetails /></PageWrapper>} />
          <Route path="/assistant" element={<PageWrapper><Assistant /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="/reports" element={<PageWrapper><Reports /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
