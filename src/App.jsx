import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import FilmGrain from './components/FilmGrain';
import Landing from './pages/Landing';
import Recommendations from './pages/Recommendations';
import MovieDetails from './pages/MovieDetails';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';

// Auth pages don't show the Navbar
const AUTH_ROUTES = ['/signup', '/login'];

// Page transition wrapper
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
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
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <FilmGrain />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
