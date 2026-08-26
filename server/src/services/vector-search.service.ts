import prisma from "../config/prisma.js";
import { generateEmbedding } from "./embedding.service.js";

interface SearchResult {
  id: number;
  documentId: number;
  chunkIndex: number;
  content: string;
  distance: number;
}

export const searchSimilarChunks = async (
  query: string,
  limit = 5
): Promise<SearchResult[]> => {
  const embedding = await generateEmbedding(query);

  const vector = `[${embedding.join(",")}]`;

  const results =
  await prisma.$queryRawUnsafe<SearchResult[]>(
    `
    SELECT
      id,
      "documentId",
      "chunkIndex",
      content,
      embedding <=> $1::vector AS distance
    FROM "DocumentChunk"
    WHERE embedding IS NOT NULL
      AND embedding <=> $1::vector < 0.55
    ORDER BY embedding <=> $1::vector
    LIMIT $2
    `,
    vector,
    limit
  );

  return results;
};