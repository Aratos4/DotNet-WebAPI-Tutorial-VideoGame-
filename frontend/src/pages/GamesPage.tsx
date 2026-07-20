import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material';
import GameForm from '../components/GameForm';

interface VideoGameReadDto {
  id: number;
  title: string;
  isReleased: boolean;
  price: number;
  releaseDate: string;
  publisherName: string;
  developerNames: string[];
  platformNames: string[];
}

interface LookupDto {
  id: number;
  name: string;
}

interface GamesPageProps {
  initialModal?: 'create' | 'edit';
}

function GamesPage({ initialModal }: GamesPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [games, setGames] = useState<VideoGameReadDto[]>([]);
  const [publishers, setPublishers] = useState<LookupDto[]>([]);
  const [developers, setDevelopers] = useState<LookupDto[]>([]);
  const [platforms, setPlatforms] = useState<LookupDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<VideoGameReadDto | null>(null);

  const fetchAllData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5055/api/VideoGames').then(res => res.json()),
      fetch('http://localhost:5055/api/Publishers').then(res => res.json()),
      fetch('http://localhost:5055/api/Developers').then(res => res.json()),
      fetch('http://localhost:5055/api/Platforms').then(res => res.json())
    ])
      .then(([gamesData, pubData, devData, platData]) => {
        setGames(gamesData);
        setPublishers(pubData);
        setDevelopers(devData);
        setPlatforms(platData);
        setLoading(false);
      })
      .catch(() => {
        alert("Could not connect to backend server!");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (initialModal === 'create') {
      setSelectedGame(null);
      setIsDialogOpen(true);
    } else if (initialModal === 'edit' && id && games.length > 0) {
      const found = games.find(g => g.id === Number(id));
      if (found) {
        setSelectedGame(found);
        setIsDialogOpen(true);
      } else {
        navigate('/games');
      }
    } else {
      setIsDialogOpen(false);
    }
  }, [initialModal, id, games, navigate]);

  const handleOpenCreate = () => {
    navigate('/games/create');
  };

  const handleOpenEdit = (game: VideoGameReadDto) => {
    navigate(`/games/${game.id}`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedGame(null);
    navigate('/games');
  };

  const handleFormSuccess = () => {
    handleCloseDialog();
    fetchAllData();
  };

  const handleDelete = (gameId: number) => {
    fetch(`http://localhost:5055/api/VideoGames/${gameId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok || res.status === 404) {
          setGames(games.filter(g => g.id !== gameId));
        } else {
          alert("Failed to delete game!");
        }
      })
      .catch(() => alert("Cannot reach server."));
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.publisherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.developerNames.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
    game.platformNames.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <Typography variant="h4" sx={{ fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
          Video Games Library
        </Typography>
        <Button variant="contained" size="large" onClick={handleOpenCreate} sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' }, fontWeight: 'bold', paddingX: 3, borderRadius: '8px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
          + Add New Game
        </Button>
      </Box>

      <Paper sx={{ padding: '16px', marginBottom: '25px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
        <TextField
          placeholder="Search library by game title, publisher, developer, or platform..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#f8fafc',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              '& fieldset': { borderColor: '#334155' },
              '&:hover fieldset': { borderColor: '#475569' },
              '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
            }
          }}
        />
      </Paper>

      {loading ? (
        <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>Loading games...</Typography>
      ) : filteredGames.length === 0 ? (
        <Paper sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>No video games found in the library.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0f172a' }}>
              <TableRow>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Title & Status</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Release Date</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Publisher</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Developer(s)</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Platform(s)</TableCell>
                <TableCell align="right" sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Price</TableCell>
                <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGames.map((game) => (
                <TableRow key={game.id} sx={{ '&:hover': { backgroundColor: '#334155' }, transition: 'background-color 0.15s' }}>
                  <TableCell sx={{ borderBottom: '1px solid #334155' }}>
                    <Typography sx={{ color: '#ffffff', fontWeight: '700', fontSize: '1.1rem' }}>
                      {game.title}
                    </Typography>
                    <Chip
                      label={game.isReleased ? 'Released' : 'Unreleased'}
                      size="small"
                      sx={{
                        marginTop: 0.5,
                        fontSize: '0.75rem',
                        height: '22px',
                        fontWeight: '600',
                        backgroundColor: game.isReleased ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: game.isReleased ? '#4ade80' : '#facc15',
                        border: game.isReleased ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(234, 179, 8, 0.4)'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>
                    {game.releaseDate && !game.releaseDate.startsWith('0001')
                      ? new Date(game.releaseDate).toLocaleDateString('en-US')
                      : 'Not Specified'}
                  </TableCell>
                  <TableCell sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>{game.publisherName}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #334155' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                      {game.developerNames.map((dev, idx) => (
                        <Chip
                          key={idx}
                          label={dev}
                          size="small"
                          sx={{
                            backgroundColor: '#334155',
                            color: '#f8fafc',
                            border: '1px solid #475569',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #334155' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                      {game.platformNames.map((plat, idx) => (
                        <Chip
                          key={idx}
                          label={plat}
                          size="small"
                          sx={{
                            backgroundColor: '#334155',
                            color: '#f8fafc',
                            border: '1px solid #475569',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#4ade80', fontWeight: '800', fontSize: '1.15rem', borderBottom: '1px solid #334155' }}>
                    ${game.price}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #334155' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button variant="contained" size="small" onClick={() => handleOpenEdit(game)} sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' }, fontWeight: '600' }}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(game.id)} sx={{ fontWeight: '600' }}>
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth slotProps={{ paper: { sx: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' } } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #334155', fontWeight: 'bold', color: '#f8fafc', fontSize: '1.3rem' }}>
          {selectedGame ? `Edit Game: ${selectedGame.title}` : 'Add New Game Entry'}
        </DialogTitle>
        <DialogContent sx={{ paddingY: 3, backgroundColor: '#1e293b' }}>
          <GameForm
            initialData={selectedGame}
            publishers={publishers}
            developers={developers}
            platforms={platforms}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default GamesPage;