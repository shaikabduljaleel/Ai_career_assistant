const OLLAMA_URL = "http://localhost:11434";

const CHAT_MODEL = "llama3.2:3b";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const generateAnswer = async (
  messages: ChatMessage[]
): Promise<string> => {
  const response = await fetch(
    `${OLLAMA_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages,
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Ollama chat failed: ${error}`
    );
  }

  const data = await response.json();

  return data.message.content;
};