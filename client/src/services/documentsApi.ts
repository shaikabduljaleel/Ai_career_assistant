const API_URL = import.meta.env.VITE_API_URL;

export interface Document {
  id: number;
  userId: number;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentResponse {
  document: Document;
  processing: {
    documentId: number;
    characters: number;
    chunks: number;
  };
}

export const getDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_URL}/documents`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Unable to fetch documents"
    );
  }

  return data.data;
};

export const uploadDocument = async (
  file: File
): Promise<UploadDocumentResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Unable to upload document"
    );
  }

  return data.data;
};

export const deleteDocument = async (
  documentId: number
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/documents/${documentId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Unable to delete document"
    );
  }
};

export const reprocessDocument = async (
  documentId: number
) => {
  const response = await fetch(
    `${API_URL}/documents/${documentId}/reprocess`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Unable to reprocess document"
    );
  }

  return data.data;
}; 