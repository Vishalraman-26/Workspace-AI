import { useCallback, useState } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import { FiUploadCloud, FiFileText, FiTrash2 } from 'react-icons/fi';
import { formatRelative } from '../../utils/date';

export default function DocumentUpload({ onUpload, uploading, progress }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={`wa-dropzone p-4 text-center ${dragActive ? 'active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      <FiUploadCloud size={36} className="text-primary mb-3" />
      <h6>Drag & drop a PDF here</h6>
      <p className="text-muted small mb-3">or choose a file from your computer</p>
      <label className="btn btn-primary btn-sm mb-0">
        Browse Files
        <input
          type="file"
          accept=".pdf,application/pdf"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </label>
      {uploading && (
        <div className="mt-3">
          <ProgressBar now={progress} label={`${progress}%`} animated striped />
        </div>
      )}
    </div>
  );
}

export function DocumentList({ documents, onDelete }) {
  if (documents.length === 0) {
    return <div className="text-muted small">No documents uploaded yet.</div>;
  }

  return (
    <div className="d-flex flex-column gap-2">
      {documents.map((doc) => (
        <div key={doc.id} className="wa-card p-3 d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
          <div className="wa-stat-icon bg-primary bg-opacity-10 text-primary">
            <FiFileText />
          </div>

          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <div className="fw-medium text-truncate" title={doc.name}>
              {doc.name}
            </div>

            <div className="small text-muted">
              {doc.chunks ? `${doc.chunks} chunks` : "Indexed"} · {formatRelative(doc.uploadedAt)}
            </div>
          </div>
        </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(doc.name)}
          >
            <FiTrash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}
