import React from 'react';
import './JsonViewer.css';

interface JsonViewerProps {
  data: any;
  error?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, error }) => {
  if (error) {
    return (
      <div className="json-viewer error">
        <h3>Error</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="json-viewer empty">
        <p>No data to display</p>
      </div>
    );
  }

  const formatJson = (obj: any, indent = 0): React.ReactNode => {
    if (obj === null) {
      return <span className="json-null">null</span>;
    }

    if (typeof obj === 'boolean') {
      return <span className="json-boolean">{obj.toString()}</span>;
    }

    if (typeof obj === 'number') {
      return <span className="json-number">{obj}</span>;
    }

    if (typeof obj === 'string') {
      return <span className="json-string">"{obj}"</span>;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return <span className="json-bracket">[]</span>;
      }

      return (
        <div className="json-array">
          <span className="json-bracket">[</span>
          <div className="json-array-content">
            {obj.map((item, index) => (
              <div key={index} className="json-array-item" style={{ marginLeft: `${(indent + 1) * 20}px` }}>
                {formatJson(item, indent + 1)}
                {index < obj.length - 1 && <span className="json-comma">,</span>}
              </div>
            ))}
          </div>
          <span className="json-bracket" style={{ marginLeft: `${indent * 20}px` }}>]</span>
        </div>
      );
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return <span className="json-bracket">{'{}'}</span>;
      }

      return (
        <div className="json-object">
          <span className="json-bracket">{'{'}</span>
          <div className="json-object-content">
            {keys.map((key, index) => (
              <div key={key} className="json-property" style={{ marginLeft: `${(indent + 1) * 20}px` }}>
                <span className="json-key">"{key}"</span>
                <span className="json-colon">: </span>
                {formatJson(obj[key], indent + 1)}
                {index < keys.length - 1 && <span className="json-comma">,</span>}
              </div>
            ))}
          </div>
          <span className="json-bracket" style={{ marginLeft: `${indent * 20}px` }}>{'}'}</span>
        </div>
      );
    }

    return <span>{String(obj)}</span>;
  };

  return (
    <div className="json-viewer">
      <h3>Response</h3>
      <pre className="json-content">
        {formatJson(data)}
      </pre>
    </div>
  );
};