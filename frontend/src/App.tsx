import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SettingsPage from './pages/SettingsPage';
import GamesPage from './pages/GamesPage';
import PublishersPage from './pages/PublishersPage';
import DevelopersPage from './pages/DevelopersPage';
import PlatformsPage from './pages/PlatformsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#121214', color: '#fff', paddingBottom: '50px' }}>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/create" element={<GamesPage initialModal="create" />} />
          <Route path="/games/:id" element={<GamesPage initialModal="edit" />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/platforms" element={<PlatformsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;