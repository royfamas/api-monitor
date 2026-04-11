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

  const deleteEndpoint = async (index) => {
    try {
      await fetch(`http://localhost:5000/endpoints/${index}`, {
        method: 'DELETE'
      });
      fetchEndpoints();
    } catch (err) {
      console.error('Error deleting endpoint:', err);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        padding: '40px',
        fontFamily: 'Arial'
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>
        API Monitoring Dashboard
      </h1>

      {/* Input Section */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px'
        }}
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL"
          style={{
            padding: '10px',
            width: '350px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={addEndpoint}
          style={{
            padding: '10px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {/* Dashboard Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}
      >
        {endpoints.map((ep, index) => {
          const last = ep.history[ep.history.length - 1];

          const statusColor =
            last?.status === 'UP'
              ? '#52c41a'
              : last?.status === 'DOWN'
              ? '#ff4d4f'
              : '#999';

          return (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ marginBottom: '10px' }}>{ep.url}</h3>

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

              {/* History */}
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
                          h.status === 'UP'
                            ? '#52c41a'
                            : '#ff4d4f'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteEndpoint(index)}
                style={{
                  marginTop: '15px',
                  padding: '6px 12px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;