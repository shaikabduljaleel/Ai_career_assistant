import { useEffect, useState } from "react";
import {
  deleteDocument,
  getDocuments,
  reprocessDocument,
  uploadDocument,
  type Document,
} from "../services/documentsApi";

function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(
    null
  );

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const result = await uploadDocument(file);

      setMessage(
        `${result.document.originalName} uploaded successfully. ` +
          `${result.processing.chunks} chunks created.`
      );

      await loadDocuments();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload document"
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again.
      event.target.value = "";
    }
  };

  const handleDelete = async (documentId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDocument(documentId);

      setDocuments((current) =>
        current.filter((document) => document.id !== documentId)
      );

      setMessage("Document deleted successfully.");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete document"
      );
    }
  };

  const handleReprocess = async (documentId: number) => {
    try {
      setProcessingId(documentId);
      setError("");
      setMessage("");

      const result = await reprocessDocument(documentId);

      setMessage(
        `Document reprocessed successfully. ` +
          `${result.chunks} chunks created.`
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to reprocess document"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-xl bg-white p-8 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                My Documents
              </h1>

              <p className="mt-2 text-gray-600">
                Upload your resume and other career documents.
                The AI assistant will use them to answer your
                questions.
              </p>
            </div>

            <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700">
              {uploading
                ? "Uploading..."
                : "Upload Document"}

              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {message && (
          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-bold">
            Uploaded Documents
          </h2>

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading documents...
            </p>
          ) : documents.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
              <p className="text-gray-500">
                You haven't uploaded any documents yet.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Upload a PDF, DOCX, or TXT file to get started.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="rounded-lg border p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {document.originalName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {document.mimeType}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatFileSize(document.size)}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Uploaded{" "}
                        {new Date(
                          document.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleReprocess(document.id)
                        }
                        disabled={
                          processingId === document.id
                        }
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                      >
                        {processingId === document.id
                          ? "Processing..."
                          : "Reprocess"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(document.id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Documents;