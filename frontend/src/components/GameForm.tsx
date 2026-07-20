import { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, OutlinedInput, Chip, Typography } from '@mui/material';

interface LookupDto {
  id: number;
  name: string;
}

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

interface GameFormProps {
  initialData: VideoGameReadDto | null;
  publishers: LookupDto[];
  developers: LookupDto[];
  platforms: LookupDto[];
  onSuccess: () => void;
  onCancel: () => void;
}

function GameForm({ initialData, publishers, developers, platforms, onSuccess, onCancel }: GameFormProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isReleased, setIsReleased] = useState<boolean>(true);
  const [releaseDate, setReleaseDate] = useState<string>(todayStr);
  const [publisherId, setPublisherId] = useState<number>(0);
  const [developerIds, setDeveloperIds] = useState<number[]>([]);
  const [platformIds, setPlatformIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPrice(initialData.price.toString());
      setIsReleased(initialData.isReleased);

      if (initialData.releaseDate && !initialData.releaseDate.startsWith('0001')) {
        setReleaseDate(initialData.releaseDate.split('T')[0]);
      } else {
        setReleaseDate(todayStr);
      }

      const foundPub = publishers.find(p => p.name === initialData.publisherName);
      setPublisherId(foundPub ? foundPub.id : 0);

      const devIds = developers
        .filter(d => initialData.developerNames.includes(d.name))
        .map(d => d.id);
      setDeveloperIds(devIds);

      const platIds = platforms
        .filter(p => initialData.platformNames.includes(p.name))
        .map(p => p.id);
      setPlatformIds(platIds);
    } else {
      setTitle('');
      setPrice('');
      setIsReleased(true);
      setReleaseDate(todayStr);
      setPublisherId(0);
      setDeveloperIds([]);
      setPlatformIds([]);
    }
  }, [initialData, publishers, developers, platforms, todayStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '' || publisherId === 0 || developerIds.length === 0 || platformIds.length === 0) {
      alert("Please fill in the title, select a publisher, and pick at least one developer and platform!");
      return;
    }

    const dateToSend = releaseDate || todayStr;
    const isoDateToSend = new Date(dateToSend).toISOString();

    const payload = {
      id: initialData ? initialData.id : 0,
      title,
      isReleased,
      price: Number(price) || 0,
      releaseDate: isoDateToSend,
      publisherId: Number(publisherId),
      developerIds,
      platformIds
    };

    const url = initialData
      ? `http://localhost:5055/api/VideoGames/${initialData.id}`
      : 'http://localhost:5055/api/VideoGames';

    const method = initialData ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) {
          onSuccess();
        } else {
          alert("Operation failed! Please check your inputs or server status.");
        }
      })
      .catch(() => alert("Could not connect to backend server. Make sure API is running in Rider."));
  };

  const inputStyle = {
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
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', marginTop: 1 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Game Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={inputStyle}
        />
        <TextField
          label="Price ($)"
          type="number"
          variant="outlined"
          required
          sx={{ width: '150px', ...inputStyle }}
          slotProps={{ htmlInput: { step: "0.01", min: "0" } }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={isReleased} onChange={(e) => setIsReleased(e.target.checked)} sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }} />}
          label={<Typography sx={{ color: '#f8fafc', fontWeight: 500 }}>Is Released?</Typography>}
        />
        <TextField
          label="Release Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          sx={{ 
            flex: 1,
            ...inputStyle,
            '& input::-webkit-calendar-picker-indicator': {
              filter: 'invert(1)',
              cursor: 'pointer'
            }
          }}
        />
      </Box>

      <FormControl fullWidth required sx={inputStyle}>
        <InputLabel id="pub-select-label">Publisher</InputLabel>
        <Select
          labelId="pub-select-label"
          value={publisherId || ''}
          label="Publisher"
          onChange={(e) => setPublisherId(Number(e.target.value))}
          MenuProps={{ slotProps: { paper: { sx: { backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } } } }}
        >
          <MenuItem value={0} disabled>-- Select a Publisher --</MenuItem>
          {publishers.map(p => (
            <MenuItem key={p.id} value={p.id} sx={{ '&:hover': { backgroundColor: '#334155' } }}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required sx={inputStyle}>
        <InputLabel id="dev-select-label">Developer(s)</InputLabel>
        <Select
          labelId="dev-select-label"
          multiple
          value={developerIds}
          onChange={(e) => setDeveloperIds(typeof e.target.value === 'string' ? [] : (e.target.value as number[]))}
          input={<OutlinedInput label="Developer(s)" />}
          MenuProps={{ slotProps: { paper: { sx: { backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } } } }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
              {selected.map((val) => {
                const dev = developers.find(d => d.id === val);
                return (
                  <Chip
                    key={val}
                    label={dev ? dev.name : val}
                    size="small"
                    sx={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', fontWeight: 500 }}
                  />
                );
              })}
            </Box>
          )}
        >
          {developers.map(d => (
            <MenuItem key={d.id} value={d.id} sx={{ '&:hover': { backgroundColor: '#334155' } }}>{d.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required sx={inputStyle}>
        <InputLabel id="plat-select-label">Platform(s)</InputLabel>
        <Select
          labelId="plat-select-label"
          multiple
          value={platformIds}
          onChange={(e) => setPlatformIds(typeof e.target.value === 'string' ? [] : (e.target.value as number[]))}
          input={<OutlinedInput label="Platform(s)" />}
          MenuProps={{ slotProps: { paper: { sx: { backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } } } }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
              {selected.map((val) => {
                const plat = platforms.find(p => p.id === val);
                return (
                  <Chip
                    key={val}
                    label={plat ? plat.name : val}
                    size="small"
                    sx={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', fontWeight: 500 }}
                  />
                );
              })}
            </Box>
          )}
        >
          {platforms.map(p => (
            <MenuItem key={p.id} value={p.id} sx={{ '&:hover': { backgroundColor: '#334155' } }}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, marginTop: 1 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ color: '#94a3b8', borderColor: '#475569', '&:hover': { borderColor: '#64748b', backgroundColor: 'rgba(255,255,255,0.05)' } }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' }, fontWeight: 'bold', paddingX: 3, borderRadius: '8px' }}>
          {initialData ? 'Update Game' : 'Save Game'}
        </Button>
      </Box>
    </Box>
  );
}

export default GameForm;