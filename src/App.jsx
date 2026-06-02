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
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/recommendations" element={<PageWrapper><Recommendations /></PageWrapper>} />
        <Route path="/movie/:id" element={<PageWrapper><MovieDetails /></PageWrapper>} />
        <Route path="/assistant" element={<PageWrapper><Assistant /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <FilmGrain />
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
