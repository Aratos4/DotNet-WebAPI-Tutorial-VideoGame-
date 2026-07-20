import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';

interface StatCounts {
  games: number;
  publishers: number;
  developers: number;
  platforms: number;
}

function SettingsPage() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [stats, setStats] = useState<StatCounts>({ games: 0, publishers: 0, developers: 0, platforms: 0 });

  const fetchLiveStatus = () => {
    setStatus('checking');
    Promise.all([
      fetch('http://localhost:5055/api/VideoGames').then(res => res.json()),
      fetch('http://localhost:5055/api/Publishers').then(res => res.json()),
      fetch('http://localhost:5055/api/Developers').then(res => res.json()),
      fetch('http://localhost:5055/api/Platforms').then(res => res.json())
    ])
      .then(([games, pubs, devs, plats]) => {
        setStats({
          games: games.length || 0,
          publishers: pubs.length || 0,
          developers: devs.length || 0,
          platforms: plats.length || 0
        });
        setStatus('online');
      })
      .catch(() => {
        setStatus('offline');
      });
  };

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <Typography variant="h4" sx={{ fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
          System Status & Live Overview
        </Typography>
        <Button
          variant="contained"
          onClick={fetchLiveStatus}
          sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' }, fontWeight: 'bold', paddingX: 3, borderRadius: '8px' }}
        >
          Refresh Live Status
        </Button>
      </Box>

      <Paper sx={{ padding: '30px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', marginBottom: '30px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: '700', marginBottom: '4px' }}>
              Backend API Connection
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Target Endpoint: http://localhost:5055/api
            </Typography>
          </Box>
          <Chip
            label={status === 'checking' ? 'Checking...' : status === 'online' ? 'Online & Connected' : 'Server Offline'}
            sx={{
              backgroundColor: status === 'online' ? 'rgba(34, 197, 94, 0.15)' : status === 'offline' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              color: status === 'online' ? '#4ade80' : status === 'offline' ? '#f87171' : '#facc15',
              border: status === 'online' ? '1px solid rgba(34, 197, 94, 0.4)' : status === 'offline' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(234, 179, 8, 0.4)',
              fontWeight: '700',
              fontSize: '0.85rem',
              paddingX: 1,
              height: '28px'
            }}
          />
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ color: '#38bdf8', marginBottom: '16px', fontWeight: '700' }}>
        Live Database Metrics
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
        <Paper sx={{ padding: '24px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Video Games
          </Typography>
          <Typography sx={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '800', marginTop: '6px' }}>
            {stats.games}
          </Typography>
        </Paper>

        <Paper sx={{ padding: '24px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Registered Publishers
          </Typography>
          <Typography sx={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '800', marginTop: '6px' }}>
            {stats.publishers}
          </Typography>
        </Paper>

        <Paper sx={{ padding: '24px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Developers
          </Typography>
          <Typography sx={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '800', marginTop: '6px' }}>
            {stats.developers}
          </Typography>
        </Paper>

        <Paper sx={{ padding: '24px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Supported Platforms
          </Typography>
          <Typography sx={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '800', marginTop: '6px' }}>
            {stats.platforms}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default SettingsPage;