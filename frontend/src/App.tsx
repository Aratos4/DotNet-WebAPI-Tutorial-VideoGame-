import { useState, useEffect } from 'react';
import './App.css';

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
  foundedDate?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'publishers' | 'developers' | 'platforms'>('games');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [games, setGames] = useState<VideoGameReadDto[]>([]);
  const [publishers, setPublishers] = useState<LookupDto[]>([]);
  const [developers, setDevelopers] = useState<LookupDto[]>([]);
  const [platforms, setPlatforms] = useState<LookupDto[]>([]);

  const [showGameForm, setShowGameForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newIsReleased, setNewIsReleased] = useState<boolean>(true);
  const [newReleaseDate, setNewReleaseDate] = useState<string>('');
  const [newPublisherId, setNewPublisherId] = useState<number>(0);
  const [newDeveloperIds, setNewDeveloperIds] = useState<number[]>([]);
  const [newPlatformIds, setNewPlatformIds] = useState<number[]>([]);

  const [showNewDevs, setShowNewDevs] = useState<boolean>(false);
  const [showNewPlats, setShowNewPlats] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editIsReleased, setEditIsReleased] = useState<boolean>(true);
  const [editReleaseDate, setEditReleaseDate] = useState<string>('');
  const [editPublisherId, setEditPublisherId] = useState<number>(0);
  const [editDeveloperIds, setEditDeveloperIds] = useState<number[]>([]);
  const [editPlatformIds, setEditPlatformIds] = useState<number[]>([]);

  const [showEditDevs, setShowEditDevs] = useState<boolean>(false);
  const [showEditPlats, setShowEditPlats] = useState<boolean>(false);

  const [newItemName, setNewItemName] = useState<string>('');
  const [newDevFoundedDate, setNewDevFoundedDate] = useState<string>('');

  const fetchAllData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5055/api/VideoGames').then(res => res.json()),
      fetch('http://localhost:5055/api/Publishers').then(res => res.json()),
      fetch('http://localhost:5055/api/Developers').then(res => res.json()),
      fetch('http://localhost:5055/api/Platforms').then(res => res.json())
    ])
      .then(([gamesData, publishersData, developersData, platformsData]) => {
        setGames(gamesData);
        setPublishers(publishersData);
        setDevelopers(developersData);
        setPlatforms(platformsData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Could not connect to the backend server. Please make sure your C# API project is running in Rider.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddGame = () => {
    if (newTitle.trim() === '' || newPublisherId === 0 || newDeveloperIds.length === 0 || newPlatformIds.length === 0) {
      alert("Please enter a game title, select a publisher, and pick at least one developer and platform!");
      return;
    }

    const createDto = {
      title: newTitle,
      isReleased: newIsReleased,
      price: Number(newPrice) || 0,
      releaseDate: newReleaseDate ? new Date(newReleaseDate).toISOString() : new Date().toISOString(),
      publisherId: Number(newPublisherId),
      developerIds: newDeveloperIds,
      platformIds: newPlatformIds
    };

    fetch('http://localhost:5055/api/VideoGames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createDto)
    })
      .then(async res => {
        if (res.ok) {
          fetchAllData();
          setNewTitle('');
          setNewPrice('');
          setNewIsReleased(true);
          setNewReleaseDate('');
          setNewPublisherId(0);
          setNewDeveloperIds([]);
          setNewPlatformIds([]);
          setShowNewDevs(false);
          setShowNewPlats(false);
          setShowGameForm(false);
        } else {
          alert("Failed to add game. A database or server error occurred.");
        }
      })
      .catch(() => alert("Cannot reach the server. Please start the API in Rider."));
  };

  const handleStartEdit = (game: VideoGameReadDto) => {
    setEditingId(game.id);
    setEditTitle(game.title);
    setEditPrice(game.price.toString());
    setEditIsReleased(game.isReleased);
    setEditReleaseDate(game.releaseDate ? game.releaseDate.split('T')[0] : '');

    const foundPub = publishers.find(p => p.name === game.publisherName);
    setEditPublisherId(foundPub ? foundPub.id : 0);

    const devIds = developers
      .filter(d => game.developerNames.includes(d.name))
      .map(d => d.id);
    setEditDeveloperIds(devIds);

    const platIds = platforms
      .filter(p => game.platformNames.includes(p.name))
      .map(p => p.id);
    setEditPlatformIds(platIds);

    setShowEditDevs(false);
    setShowEditPlats(false);
  };

  const handleUpdateGame = (id: number) => {
    if (editTitle.trim() === '' || editPublisherId === 0 || editDeveloperIds.length === 0 || editPlatformIds.length === 0) {
      alert("Please enter a game title, select a publisher, and pick at least one developer and platform!");
      return;
    }

    const updateDto = {
      id: id,
      title: editTitle,
      isReleased: editIsReleased,
      price: Number(editPrice) || 0,
      releaseDate: editReleaseDate ? new Date(editReleaseDate).toISOString() : new Date().toISOString(),
      publisherId: Number(editPublisherId),
      developerIds: editDeveloperIds,
      platformIds: editPlatformIds
    };

    fetch(`http://localhost:5055/api/VideoGames/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateDto)
    })
      .then(res => {
        if (res.ok) {
          fetchAllData();
          setEditingId(null);
        } else {
          alert("Update failed.");
        }
      })
      .catch(() => alert("Cannot reach the server. Please start the API in Rider."));
  };

  const handleDeleteGame = (id: number) => {
    fetch(`http://localhost:5055/api/VideoGames/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok || res.status === 404) {
          setGames(games.filter(g => g.id !== id));
        } else {
          alert("Failed to delete the game.");
        }
      })
      .catch(() => alert("Cannot reach the server. Please start the API in Rider."));
  };

  const handleAddLookupItem = (type: 'Publishers' | 'Developers' | 'Platforms') => {
    if (newItemName.trim() === '') return;

    const bodyData = type === 'Developers'
      ? { name: newItemName, foundedDate: newDevFoundedDate ? new Date(newDevFoundedDate).toISOString() : new Date().toISOString() }
      : { name: newItemName };

    fetch(`http://localhost:5055/api/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    })
      .then(async res => {
        if (res.ok) {
          fetchAllData();
          setNewItemName('');
          setNewDevFoundedDate('');
        } else {
          alert("Failed to add item! A server error occurred.");
        }
      })
      .catch(() => {
        alert("Could not connect to the backend server! Please check port 5055.");
      });
  };

  const handleDeleteLookupItem = (id: number, type: 'Publishers' | 'Developers' | 'Platforms') => {
    fetch(`http://localhost:5055/api/${type}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok || res.status === 404) {
          fetchAllData();
        } else {
          alert("Deletion failed. There might be a game linked to this record.");
        }
      })
      .catch(() => alert("Cannot reach the server. Please start the API in Rider."));
  };

  const toggleCheckbox = (id: number, currentList: number[], setList: (val: number[]) => void) => {
    if (currentList.includes(id)) {
      setList(currentList.filter(item => item !== id));
    } else {
      setList([...currentList, id]);
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.publisherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.developerNames.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
    game.platformNames.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <h1 className="main-title">Video Game Library</h1>

      <div className="nav-tabs">
        <button className={`action-btn ${activeTab === 'games' ? 'active' : ''}`} onClick={() => setActiveTab('games')}>Games ({games.length})</button>
        <button className={`action-btn ${activeTab === 'publishers' ? 'active' : ''}`} onClick={() => setActiveTab('publishers')}>Publishers ({publishers.length})</button>
        <button className={`action-btn ${activeTab === 'developers' ? 'active' : ''}`} onClick={() => setActiveTab('developers')}>Developers ({developers.length})</button>
        <button className={`action-btn ${activeTab === 'platforms' ? 'active' : ''}`} onClick={() => setActiveTab('platforms')}>Platforms ({platforms.length})</button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {activeTab === 'games' && (
            <div>
              <div style={{ marginBottom: '25px' }}>
                <button className="action-btn" onClick={() => setShowGameForm(!showGameForm)}>
                  {showGameForm ? 'Hide Form' : 'Add New Game'}
                </button>

                {showGameForm && (
                  <div className="form-card">
                    <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>New Game Entry</h3>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <input
                        type="text"
                        placeholder="Game Title (E.g., The Witcher 3)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="form-input"
                        style={{ flex: 2 }}
                      />
                      <input
                        type="number"
                        placeholder="Price ($) - E.g., 59.99"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                      <label className="checkbox-label" style={{ color: '#e1bee7', fontWeight: 'bold' }}>
                        <input
                          type="checkbox"
                          checked={newIsReleased}
                          onChange={(e) => setNewIsReleased(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#9c27b0' }}
                        />
                        Is Released?
                      </label>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <span style={{ color: '#aaa', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Release Date:</span>
                        <input
                          type="date"
                          value={newReleaseDate}
                          onChange={(e) => setNewReleaseDate(e.target.value)}
                          className="form-input"
                          style={{ margin: 0, padding: '8px' }}
                        />
                      </div>
                    </div>

                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#aaa' }}>Select Publisher (Only 1):</label>
                    <select
                      value={newPublisherId}
                      onChange={(e) => setNewPublisherId(Number(e.target.value))}
                      className="form-select"
                    >
                      <option value={0}>-- Please Select a Publisher --</option>
                      {publishers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#aaa' }}>Select Developer(s) (Multiple Allowed):</label>
                    <div
                      className="form-select"
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showNewDevs ? '5px' : '15px', userSelect: 'none' }}
                      onClick={() => setShowNewDevs(!showNewDevs)}
                    >
                      <span>{newDeveloperIds.length === 0 ? "-- Click to Select Developer(s) --" : `${newDeveloperIds.length} Developer(s) Selected`}</span>
                      <span>{showNewDevs ? "▲" : "▼"}</span>
                    </div>
                    {showNewDevs && (
                      <div className="checkbox-group" style={{ marginBottom: '15px' }}>
                        {developers.map(d => (
                          <label key={d.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={newDeveloperIds.includes(d.id)}
                              onChange={() => toggleCheckbox(d.id, newDeveloperIds, setNewDeveloperIds)}
                              style={{ width: '16px', height: '16px', accentColor: '#9c27b0' }}
                            />
                            {d.name}
                          </label>
                        ))}
                      </div>
                    )}

                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#aaa' }}>Select Platform(s) (Multiple Allowed):</label>
                    <div
                      className="form-select"
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showNewPlats ? '5px' : '15px', userSelect: 'none' }}
                      onClick={() => setShowNewPlats(!showNewPlats)}
                    >
                      <span>{newPlatformIds.length === 0 ? "-- Click to Select Platform(s) --" : `${newPlatformIds.length} Platform(s) Selected`}</span>
                      <span>{showNewPlats ? "▲" : "▼"}</span>
                    </div>
                    {showNewPlats && (
                      <div className="checkbox-group" style={{ marginBottom: '15px' }}>
                        {platforms.map(p => (
                          <label key={p.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={newPlatformIds.includes(p.id)}
                              onChange={() => toggleCheckbox(p.id, newPlatformIds, setNewPlatformIds)}
                              style={{ width: '16px', height: '16px', accentColor: '#9c27b0' }}
                            />
                            {p.name}
                          </label>
                        ))}
                      </div>
                    )}

                    <button className="action-btn" onClick={handleAddGame} style={{ width: '100%', backgroundColor: '#4CAF50', marginTop: '10px', fontSize: '1.1rem' }}>
                      Save Game to Database
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Search library by game title, publisher, developer, or platform..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              {filteredGames.length === 0 ? (
                <p style={{ color: '#888', fontSize: '1.1rem', marginTop: '30px' }}>No games found in the library.</p>
              ) : (
                <ul className="game-list">
                  {filteredGames.map((game) => (
                    <li key={game.id} className="game-item" style={{ display: 'block' }}>
                      {editingId === game.id ? (
                        <div className="form-card" style={{ margin: '0', maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}>
                          <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px', color: '#e1bee7' }}>
                            Edit Game: {game.title}
                          </h3>

                          <div style={{ display: 'flex', gap: '15px' }}>
                            <input
                              type="text"
                              placeholder="Game Title"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="form-input"
                              style={{ flex: 2 }}
                            />
                            <input
                              type="number"
                              placeholder="Price ($) - E.g., 59.99"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="form-input"
                              style={{ flex: 1 }}
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                            <label className="checkbox-label" style={{ color: '#e1bee7', fontWeight: 'bold' }}>
                              <input
                                type="checkbox"
                                checked={editIsReleased}
                                onChange={(e) => setEditIsReleased(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: '#9c27b0' }}
                              />
                              Is Released?
                            </label>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                              <span style={{ color: '#aaa', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Release Date:</span>
                              <input
                                type="date"
                                value={editReleaseDate}
                                onChange={(e) => setEditReleaseDate(e.target.value)}
                                className="form-input"
                                style={{ margin: 0, padding: '8px' }}
                              />
                            </div>
                          </div>

                          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#aaa' }}>Select Publisher:</label>
                          <select
                            value={editPublisherId}
                            onChange={(e) => setEditPublisherId(Number(e.target.value))}
                            className="form-select"
                          >
                            <option value={0}>-- Please Select a Publisher --</option>
                            {publishers.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>

                          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#aaa' }}>Select Developer(s):</label>
                          <div
                            className="form-select"
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showEditDevs ? '5px' : '15px', userSelect: 'none' }}
                            onClick={() => setShowEditDevs(!showEditDevs)}
                          >
                            <span>{editDeveloperIds.length === 0 ? "-- Click to Select Developer(s) --" : `${editDeveloperIds.length} Developer(s) Selected`}</span>
                            <span>{showEditDevs ? "▲" : "▼"}</span>
                          </div>
                          {showEditDevs && (
                            <div className="checkbox-group" style={{ marginBottom: '15px' }}>
                              {developers.map(d => (
                                <label key={d.id} className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={editDeveloperIds.includes(d.id)}
                                    onChange={() => toggleCheckbox(d.id, editDeveloperIds, setEditDeveloperIds)}
                                    style={{ width: '16px', height: '16px', accentColor: '#9c27b0' }}
                                  />
                                  {d.name}
                                </label>
                              ))}
                            </div>
                          )}

                          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#aaa' }}>Select Platform(s):</label>
                          <div
                            className="form-select"
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showEditPlats ? '5px' : '15px', userSelect: 'none' }}
                            onClick={() => setShowEditPlats(!showEditPlats)}
                          >
                            <span>{editPlatformIds.length === 0 ? "-- Click to Select Platform(s) --" : `${editPlatformIds.length} Platform(s) Selected`}</span>
                            <span>{showEditPlats ? "▲" : "▼"}</span>
                          </div>
                          {showEditPlats && (
                            <div className="checkbox-group" style={{ marginBottom: '15px' }}>
                              {platforms.map(p => (
                                <label key={p.id} className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={editPlatformIds.includes(p.id)}
                                    onChange={() => toggleCheckbox(p.id, editPlatformIds, setEditPlatformIds)}
                                    style={{ width: '16px', height: '16px', accentColor: '#9c27b0' }}
                                  />
                                  {p.name}
                                </label>
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button className="action-btn" onClick={() => handleUpdateGame(game.id)} style={{ backgroundColor: '#4CAF50', flex: 1 }}>
                              Save Changes
                            </button>
                            <button className="action-btn" onClick={() => setEditingId(null)} style={{ backgroundColor: '#757575', flex: 1 }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <div>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: '#fff' }}>
                              {game.title}{' '}
                              <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: game.isReleased ? '#1b5e20' : '#e65100', color: '#fff', verticalAlign: 'middle' }}>
                                {game.isReleased ? 'Released' : 'Unreleased'}
                              </span>
                            </h3>
                            <p style={{ margin: '0 0 6px 0', color: '#bbb' }}>
                              <strong>Release Date:</strong> {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('en-US') : 'Not specified'} | <strong>Publisher:</strong> {game.publisherName} | <strong>Price:</strong> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{game.price} $</span>
                            </p>
                            <p style={{ margin: '0 0 6px 0', color: '#bbb' }}><strong>Developer(s):</strong> {game.developerNames.join(', ')}</p>
                            <p style={{ margin: 0, color: '#bbb' }}><strong>Platform(lar):</strong> {game.platformNames.join(', ')}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="action-btn" onClick={() => handleStartEdit(game)} style={{ backgroundColor: '#1976d2', padding: '10px 16px' }}>Edit</button>
                            <button className="action-btn" onClick={() => handleDeleteGame(game.id)} style={{ backgroundColor: '#d32f2f', padding: '10px 16px' }}>Delete</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab !== 'games' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New {activeTab === 'publishers' ? 'Publisher' : activeTab === 'developers' ? 'Developer' : 'Platform'}</h2>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter name (E.g., Electronic Arts, Steam, PC)..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="form-input"
                  style={{ flex: 2, margin: 0 }}
                />
                
                {activeTab === 'developers' && (
                  <input
                    type="date"
                    title="Founded Date"
                    value={newDevFoundedDate}
                    onChange={(e) => setNewDevFoundedDate(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, margin: 0 }}
                  />
                )}

                <button
                  className="action-btn"
                  onClick={() => handleAddLookupItem(activeTab === 'publishers' ? 'Publishers' : activeTab === 'developers' ? 'Developers' : 'Platforms')}
                  style={{ backgroundColor: '#4CAF50', whiteSpace: 'nowrap' }}
                >
                  Add
                </button>
              </div>

              <ul className="lookup-list">
                {(activeTab === 'publishers' ? publishers : activeTab === 'developers' ? developers : platforms).map(item => (
                  <li key={item.id} className="lookup-item">
                    <span>
                      <strong style={{ color: '#9c27b0' }}>#{item.id}</strong> - {item.name}
                      {item.foundedDate && (
                        <span style={{ fontSize: '0.85rem', color: '#aaa', marginLeft: '10px' }}>
                          (Founded: {new Date(item.foundedDate).toLocaleDateString('en-US')})
                        </span>
                      )}
                    </span>
                    <button
                      className="action-btn"
                      onClick={() => handleDeleteLookupItem(item.id, activeTab === 'publishers' ? 'Publishers' : activeTab === 'developers' ? 'Developers' : 'Platforms')}
                      style={{ backgroundColor: '#d32f2f', padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;