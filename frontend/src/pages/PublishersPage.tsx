import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface LookupDto {
  id: number;
  name: string;
}

function PublishersPage() {
  const [publishers, setPublishers] = useState<LookupDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newItemName, setNewItemName] = useState<string>('');

  const fetchPublishers = () => {
    setLoading(true);
    fetch('http://localhost:5055/api/Publishers')
      .then(res => res.json())
      .then(data => {
        setPublishers(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Could not connect to backend server!");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleAdd = () => {
    if (newItemName.trim() === '') return;

    fetch('http://localhost:5055/api/Publishers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItemName })
    })
      .then(async res => {
        if (res.ok) {
          fetchPublishers();
          setNewItemName('');
        } else {
          alert("Failed to add publisher!");
        }
      })
      .catch(() => alert("Cannot reach server. Check Rider."));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5055/api/Publishers/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok || res.status === 404) {
          fetchPublishers();
        } else {
          alert("Cannot delete publisher. It might be tied to a game.");
        }
      })
      .catch(() => alert("Cannot reach server."));
  };

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" sx={{ fontWeight: '800', marginBottom: '25px', textAlign: 'left', color: '#f8fafc', letterSpacing: '-0.5px' }}>
        Publishers Management
      </Typography>

      <Paper sx={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }}>
        <TextField
          label="Publisher Name (E.g., Electronic Arts)"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
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
        <Button variant="contained" onClick={handleAdd} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', paddingX: 3, backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' }, borderRadius: '8px' }}>
          Add Publisher
        </Button>
      </Paper>

      {loading ? (
        <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>Loading publishers...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0f172a' }}>
              <TableRow>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>ID</TableCell>
                <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Publisher Name</TableCell>
                <TableCell align="right" sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #334155' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publishers.map((pub) => (
                <TableRow key={pub.id} sx={{ '&:hover': { backgroundColor: '#334155' }, transition: 'background-color 0.15s' }}>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid #334155' }}>#{pub.id}</TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#ffffff', fontSize: '1.05rem', borderBottom: '1px solid #334155' }}>{pub.name}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #334155' }}>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(pub.id)} sx={{ fontWeight: '600' }}>
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

export default PublishersPage;