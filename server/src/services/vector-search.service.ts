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
  userId: number,
  limit = 5
): Promise<SearchResult[]> => {
  const embedding = await generateEmbedding(query);

  const vector = `[${embedding.join(",")}]`;

  const results =
  await prisma.$queryRawUnsafe<SearchResult[]>(
    `
    SELECT
      dc.id,
      dc."documentId",
      dc."chunkIndex",
      dc.content,
      dc.embedding <=> $1::vector AS distance
    FROM "DocumentChunk" dc
    INNER JOIN "Document" d ON dc."documentId" = d.id
    WHERE d."userId" = $3
      AND dc.embedding IS NOT NULL
      AND dc.embedding <=> $1::vector < 0.55
    ORDER BY dc.embedding <=> $1::vector
    LIMIT $2
    `,
    vector,
    limit,
    userId
  );

  return results;
};