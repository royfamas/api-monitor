import React, { useState, useEffect } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [endpoints, setEndpoints] = useState([]);

  const fetchEndpoints = async () => {
    const res = await fetch('http://localhost:5000/endpoints');
    const data = await res.json();
    setEndpoints(data);
  };

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 5000);
    return () => clearInterval(interval);
  }, []);

  const addEndpoint = async () => {
    await fetch('http://localhost:5000/endpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    setUrl('');
    fetchEndpoints();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Monitor</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL"
      />
      <button onClick={addEndpoint}>Add</button>

      <ul>
        {endpoints.map((ep, index) => {
          const last = ep.history[ep.history.length - 1];

          return (
            <li key={index}>
              <strong>{ep.url}</strong> —{' '}
              {last ? last.status : 'Checking...'}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;