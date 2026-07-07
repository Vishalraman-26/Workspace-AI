import api from './api';

const ragApi = {
  uploadDocument: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('document', file);

    return api.post('/rag/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },

  askQuestion: (question) => api.post('/rag/ask', { question }),
  getDocuments: () => api.get('/rag/documents'),
  deleteDocument:(title)=> {
    console.log(title)
    return api.delete(`/rag/documents/${encodeURIComponent(title)}`)
  }
};

export default ragApi;
