import prisma from "../config/prisma.js";

import {
  generateEmbedding,
} from "./embedding.service.js";

export const embedDocumentChunks = async (
  documentId: number
) => {
  const chunks = await prisma.$queryRaw<
    { id: number; content: string }[]
  >`
    SELECT id, content
    FROM "DocumentChunk"
    WHERE "documentId" = ${documentId}
      AND embedding IS NULL
    ORDER BY "chunkIndex" ASC
  `;

  for (const chunk of chunks) {
    const embedding =
      await generateEmbedding(
        chunk.content
      );

    const vector =
      `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `
      UPDATE "DocumentChunk"
      SET embedding = $1::vector
      WHERE id = $2
      `,
      vector,
      chunk.id
    );
  }

  return {
    documentId,
    embeddedChunks: chunks.length,
  };
};
