import React, { useState } from 'react';
import { JsonViewer } from './components/JsonViewer';
import { parseCurlCommand } from './utils/curlParser';
import { executeCurl, CurlResponse } from './services/curlExecutor';
import './App.css';

function App() {
  const [curlCommand, setCurlCommand] = useState('');
  const [response, setResponse] = useState<CurlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!curlCommand.trim()) {
      setError('Please enter a curl command');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const parsed = parseCurlCommand(curlCommand);
      const result = await executeCurl(parsed);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCurlCommand('');
    setResponse(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleExecute();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Curl2JSON</h1>
        <p>Paste your curl command and see the JSON response beautifully formatted</p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <label htmlFor="curl-input">Curl Command</label>
          <textarea
            id="curl-input"
            value={curlCommand}
            onChange={(e) => setCurlCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`curl -X GET 'https://api.example.com/data' \\
  -H 'Authorization: Bearer token' \\
  -H 'Accept: application/json'`}
            rows={8}
            className="curl-input"
          />
          <div className="button-group">
            <button
              onClick={handleExecute}
              disabled={loading || !curlCommand.trim()}
              className="execute-button"
            >
              {loading ? 'Executing...' : 'Execute (Ctrl+Enter)'}
            </button>
            <button
              onClick={handleClear}
              className="clear-button"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="response-section">
          {response && (
            <div className="response-meta">
              <span className={`status-code ${response.status >= 200 && response.status < 300 ? 'success' : 'error'}`}>
                {response.status} {response.statusText}
              </span>
              <span className="response-time">
                Content-Type: {response.headers['content-type'] || 'unknown'}
              </span>
            </div>
          )}
          
          <JsonViewer 
            data={response?.data} 
            error={error || undefined}
          />
        </div>
      </main>
    </div>
  );
}

export default App;