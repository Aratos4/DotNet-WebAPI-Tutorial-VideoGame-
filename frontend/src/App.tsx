import { useState, useEffect } from 'react';
import './App.css';

interface Game {
  id: number;
  title: string; 
  developer: string;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  const [searchTerm, setSearchTerm] = useState<string>('');

  
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDeveloper, setNewDeveloper] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDeveloper, setEditDeveloper] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5055/api/videogames')
      .then(res => res.json())
      .then(data => { 
        // Backend'de OrderBy yapmıştık, burada direkt alıyoruz
        setGames(data); 
        setLoading(false); 
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleAddGame = () => {
    if (newTitle.trim() === '' || newDeveloper.trim() === '') return;
    fetch('http://localhost:5055/api/videogames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, developer: newDeveloper })
    })
      .then(res => res.json())
      .then(addedGame => {
        setGames([...games, addedGame]);
        setNewTitle('');
        setNewDeveloper('');
        setShowForm(false);
      });
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5055/api/videogames/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) setGames(games.filter(g => g.id !== id));
      });
  };

  const handleUpdate = (id: number) => {
    if (editTitle.trim() === '' || editDeveloper.trim() === '') return;
    const updatedGame = { id, title: editTitle, developer: editDeveloper };
    fetch(`http://localhost:5055/api/videogames/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGame)
    })
      .then(res => {
        if (res.ok) {
          setGames(games.map(g => g.id === id ? updatedGame : g));
          setEditingId(null);
        }
      });
  };

  
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.developer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Oyun Kütüphanesi Yönetim Paneli</h1>

      <div style={{ marginBottom: '20px' }}>
        <button className="action-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Formu Gizle' : 'Yeni Oyun Ekle'}
        </button>

        {showForm && (
          <div style={{ marginTop: '15px', padding: '15px', border: '1px solid gray', borderRadius: '5px' }}>
            <input 
              type="text" 
              placeholder="Oyun Adı" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <input 
              type="text" 
              placeholder="Geliştirici" 
              value={newDeveloper}
              onChange={(e) => setNewDeveloper(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <button className="action-btn" onClick={handleAddGame}>Kaydet</button>
          </div>
        )}
      </div>

      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="🔍 Kütüphanede oyun veya geliştirici ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #666' }}
        />
      </div>
      
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div>
          
          {filteredGames.length === 0 ? <p>Aradığınız kriterde oyun bulunamadı.</p> : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {filteredGames.map((game) => (
                <li key={game.id} className="game-item">
                  {editingId === game.id ? (
                    <div>
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ marginRight: '10px' }} />
                      <input value={editDeveloper} onChange={(e) => setEditDeveloper(e.target.value)} style={{ marginRight: '10px' }} />
                      <button className="action-btn" onClick={() => handleUpdate(game.id)}>Kaydet</button>
                      <button className="action-btn" onClick={() => setEditingId(null)}>İptal</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>{game.title}</strong> - {game.developer}
                      </div>
                      <div>
                        <button className="action-btn" onClick={() => {
                          setEditingId(game.id);
                          setEditTitle(game.title);
                          setEditDeveloper(game.developer);
                        }}>Değiştir</button>
                        <button className="action-btn" onClick={() => handleDelete(game.id)}>Sil</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;