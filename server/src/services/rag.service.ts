import {
  searchSimilarChunks,
} from "./vector-search.service.js";

import {
  generateAnswer,
} from "./llm.service.js";

export const askQuestion = async (
  question: string,
  userId: number
) => {
  const startTime = Date.now();
  console.log(`[RAG] Starting to process question: "${question.substring(0, 50)}..."`);

  // 1. Retrieve relevant chunks
  const embeddingStart = Date.now();
  const chunks =
    await searchSimilarChunks(
      question,
      userId,
      5
    );
  const embeddingTime = Date.now() - embeddingStart;
  console.log(`[RAG] Similarity search completed in ${embeddingTime}ms, found ${chunks.length} chunks`);

  // 2. Build context
  const context = chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}]\n${chunk.content}`
    )
    .join("\n\n");

  // 3. Tell the LLM to use only the retrieved context
  const systemPrompt = `
You are an AI Career Assistant.

Your job is to answer questions about the user's
career, skills, education, projects, experience,
and uploaded documents.

IMPORTANT RULES:

1. Use ONLY the information provided in CONTEXT.
2. Do not invent information.
3. If the context does not contain the answer,
   say that you don't have enough information.
4. Carefully distinguish between:
   - Frontend technologies
   - Backend technologies
   - Databases
   - Programming languages
   - Machine Learning
   - Deep Learning
   - Tools and frameworks
5. Do not classify a backend technology or database
   as a frontend technology.
6. Give concise, clear answers.
7. When listing technologies, group them correctly.

CONTEXT:

${context}
`;

  // 4. Ask the LLM
  const llmStart = Date.now();
  const answer =
    await generateAnswer([
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: question,
      },
    ]);
  const llmTime = Date.now() - llmStart;
  const totalTime = Date.now() - startTime;

  console.log(`[RAG] LLM response generated in ${llmTime}ms`);
  console.log(`[RAG] Total processing time: ${totalTime}ms`);

  return {
    answer,
    sources: chunks,
  };
};