import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface Source {
  id: number;
  documentId: number;
  chunkIndex: number;
  content: string;
  distance: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

function Chat() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setInput("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: message,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to get response"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.data.answer,
          sources: data.data.sources,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold">
          AI Career Assistant
        </h1>

        <p className="text-sm text-gray-500">
          Ask questions about your career,
          skills and documents.
        </p>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              <h2 className="text-xl font-semibold">
                Ask me anything
              </h2>

              <p className="mt-2 text-gray-500">
                Try asking:
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  "What frontend technologies
                  do I know?"
                </p>

                <p>
                  "Tell me about my projects."
                </p>

                <p>
                  "What machine learning
                  experience do I have?"
                </p>
              </div>
            </div>
          )}

          {messages.map(
            (message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-2xl rounded-2xl bg-blue-600 px-5 py-3 text-white"
                      : "max-w-2xl rounded-2xl bg-white px-5 py-4 shadow"
                  }
                >
                  <p className="whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.sources &&
                    message.sources.length >
                      0 && (
                      <details className="mt-4 border-t pt-3">
                        <summary className="cursor-pointer text-sm font-medium">
                          Sources
                        </summary>

                        <div className="mt-3 space-y-3">
                          {message.sources.map(
                            (source) => (
                              <div
                                key={
                                  source.id
                                }
                                className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600"
                              >
                                <p>
                                  Chunk{" "}
                                  {source.chunkIndex +
                                    1}
                                </p>

                                <p className="mt-1">
                                  Similarity:{" "}
                                  {(
                                    1 -
                                    source.distance
                                  ).toFixed(
                                    3
                                  )}
                                </p>

                                <p className="mt-2">
                                  {
                                    source.content
                                  }
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </details>
                    )}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-5 py-4 shadow">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-white p-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage();
          }}
          className="mx-auto flex max-w-4xl gap-3"
        >
          <input
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask about your career..."
            className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={
              loading ||
              input.trim().length === 0
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Chat;