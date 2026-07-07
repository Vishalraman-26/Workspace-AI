import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ragApi from '../services/rag.api';
import DocumentUpload, { DocumentList } from '../components/rag/DocumentUpload';
import RagQueryPanel from '../components/rag/RagQueryPanel';
import ErrorAlert from '../components/common/ErrorAlert';
import { getErrorMessage } from '../utils/helpers';

export default function Knowledge() {

  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState(null);
  const [lastSource, setLastSource] = useState(null);
  useEffect(() => {
    loadDocuments();
  }, []);
  const loadDocuments = async () => {
    try {
      const { data } = await ragApi.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error loading documents:", err);
      setDocuments([]);
    }
  };  
  const handleUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const { data } = await ragApi.uploadDocument(file, (event) => {
        const percent = Math.round((event.loaded * 100) / (event.total || 1));
        setUploadProgress(percent);
      });

      await loadDocuments();
    } catch (err) {
      setUploadError(getErrorMessage(err, 'Upload failed'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAsk = async (value) => {
    setAsking(true);
    setAskError(null);
    setAnswer('');

    try {
      const { data } = await ragApi.askQuestion(value);
      setAnswer(data.answer || 'No answer returned.');
      setLastSource(documents[0]?.name || null);
    } catch (err) {
      setAskError(getErrorMessage(err, 'Failed to get answer'));
    } finally {
      setAsking(false);
    }
  };
  const removeDocument = async (title) => {

    const confirmed = window.confirm(

        `Delete "${title}"?`

    );

    if (!confirmed) return;

    try {
        console.log(title)

        await ragApi.deleteDocument(title);

        await loadDocuments();

        if (lastSource === title) {

            setAnswer("");

            setLastSource(null);

        }

    } catch (err) {

        alert(getErrorMessage(err, "Failed to delete document"));

    }

};
  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 fw-semibold mb-1">Knowledge Base</h2>
        <p className="text-muted mb-0">Upload documents and ask questions with RAG-powered answers</p>
      </div>

      <Row className="g-4">
        <Col lg={5}>
          <div className="wa-card p-4 mb-4">
            <h5 className="mb-3">Upload PDF</h5>
            <DocumentUpload onUpload={handleUpload} uploading={uploading} progress={uploadProgress} />
            {uploadError && <ErrorAlert message={uploadError} className="mt-3" />}
          </div>

          <div className="wa-card p-4">
            <h5 className="mb-3">Documents</h5>
            <DocumentList documents={documents} onDelete={removeDocument} />
          </div>
        </Col>

        <Col lg={7}>
          <div className="wa-card p-4 h-100">
            <h5 className="mb-4">Ask a Question</h5>
            {askError && <ErrorAlert message={askError} className="mb-3" />}
            <RagQueryPanel
              question={question}
              onQuestionChange={setQuestion}
              onSubmit={handleAsk}
              loading={asking}
              answer={answer}
              sourceDocument={lastSource}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
