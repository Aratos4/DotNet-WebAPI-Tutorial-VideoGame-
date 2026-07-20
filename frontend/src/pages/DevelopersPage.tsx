import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface LookupDto {
  id: number;
  name: string;
  foundedDate?: string;
}

function DevelopersPage() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [developers, setDevelopers] = useState<LookupDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newDevFoundedDate, setNewDevFoundedDate] = useState<string>(todayStr);

  const fetchDevelopers = () => {
    setLoading(true);
    fetch('http://localhost:5055/api/Developers')
      .then(res => res.json())
      .then(data => {
        setDevelopers(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Could not connect to backend server!");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleAdd = () => {
    if (newItemName.trim() === '') return;

    const dateToSend = newDevFoundedDate || todayStr;
    const isoDateToSend = new Date(dateToSend).toISOString();

    const bodyData = {
      name: newItemName,
      foundedDate: isoDateToSend
    };

    fetch('http://localhost:5055/api/Developers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    })
      .then(async res => {
        if (res.ok) {
          fetchDevelopers();
          setNewItemName('');
          setNewDevFoundedDate(todayStr);
        } else {
          alert("Failed to add developer!");
        }
      })
      .catch(() => alert("Cannot reach server. Check Rider."));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5055/api/Developers/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok || res.status === 404) {
          fetchDevelopers();
        } else {
          alert("Cannot delete developer. It might be tied to a game.");
        }
      })
      .catch(() => alert("Cannot reach server."));
  };

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" sx={{ fontWeight: '800', marginBottom: '25px', textAlign: 'left', color: '#f8fafc', letterSpacing: '-0.5px' }}>
        Developers Management
      </Typography>

      <Paper sx={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
        <TextField
          label="Developer Name (E.g., Rockstar Games)"
          variant="outlined"
          size="small"
          sx={{
            flex: 2,
            '& .MuiOutlinedInput-root': {
              color: '#f8fafc',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              '& fieldset': { borderColor: '#334155' },
              '&:hover fieldset': { borderColor: '#475569' },
              '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
            },
            '& .MuiInputLabel-root': { color: '#94a3b8' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' }
          }}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <TextField
          type="date"
          label="Founded Date"
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              color: '#f8fafc',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              '& fieldset': { borderColor: '#334155' },
              '&:hover fieldset': { borderColor: '#475569' },
              '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
            },
            '& .MuiInputLabel-root': { color: '#94a3b8' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
            '& input::-webkit-calendar-picker-indicator': {
              filter: 'invert(1)',
              cursor: 'pointer'
            }
          }}
          value={newDevFoundedDate}
          onChange={(e) => setNewDevFoundedDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', paddingX: 3, backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' }, borderRadius: '8px' }}>
          Add Developer
        </Button>
      </Paper>

      {loading ? (
        <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>Loading developers...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0f172a' }}>
              <TableRow>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>ID</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Developer Name</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Founded Date</TableCell>
                <TableCell align="right" sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {developers.map((dev) => (
                <TableRow key={dev.id} sx={{ '&:hover': { backgroundColor: '#334155' }, transition: 'background-color 0.15s' }}>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid #334155' }}>#{dev.id}</TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#ffffff', fontSize: '1.05rem', borderBottom: '1px solid #334155' }}>{dev.name}</TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>
                    {dev.foundedDate && !dev.foundedDate.startsWith('0001')
                      ? new Date(dev.foundedDate).toLocaleDateString('en-US')
                      : 'Not Specified'}
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #334155' }}>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(dev.id)} sx={{ fontWeight: '600' }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default DevelopersPage;