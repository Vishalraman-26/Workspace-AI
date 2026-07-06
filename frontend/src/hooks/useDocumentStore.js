import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'workspace_ai_documents';

function loadDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function useDocumentStore() {
  const [documents, setDocuments] = useState(loadDocuments);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const addDocument = useCallback((doc) => {
    setDocuments((prev) => [doc, ...prev]);
  }, []);

  const removeDocument = useCallback((id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  return { documents, addDocument, removeDocument };
}
