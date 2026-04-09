import React, { useState, useEffect } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [endpoints, setEndpoints] = useState([]);

  const fetchEndpoints = async () => {
    try {
      const res = await fetch('http://localhost:5000/endpoints');
      const data = await res.json();
      setEndpoints(data);
    } catch (err) {
      console.error('Error fetching endpoints:', err);
    }
  };

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 5000);
    return () => clearInterval(interval);
  }, []);

  const addEndpoint = async () => {
    if (!url) return;

    try {
      await fetch('http://localhost:5000/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      setUrl('');
      fetchEndpoints();
    } catch (err) {
      console.error('Error adding endpoint:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>API Monitoring Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={addEndpoint} style={{ padding: '8px 12px' }}>
          Add Endpoint
        </button>
      </div>

      {endpoints.map((ep, index) => {
        const last = ep.history[ep.history.length - 1];

        const statusColor =
          last?.status === 'UP'
            ? 'green'
            : last?.status === 'DOWN'
            ? 'red'
            : 'gray';

        return (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px'
            }}
          >
            <h3>{ep.url}</h3>

            <p>
              Status:{' '}
              <strong style={{ color: statusColor }}>
                {last ? last.status : 'Checking...'}
              </strong>
            </p>

            <p>
              Response Time:{' '}
              {last && last.responseTime
                ? `${last.responseTime} ms`
                : 'N/A'}
            </p>

            <p>
              Last Checked:{' '}
              {last
                ? new Date(last.time).toLocaleTimeString()
                : 'N/A'}
            </p>

            <div style={{ marginTop: '10px' }}>
              <strong>History:</strong>
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                  marginTop: '5px'
                }}
              >
                {ep.history.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor:
                        h.status === 'UP' ? 'green' : 'red'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;