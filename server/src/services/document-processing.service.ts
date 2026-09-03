import prisma from "../config/prisma.js";

import {
  extractTextFromDocument,
} from "./document-parser.service.js";

import {
  chunkText,
} from "./chunk.service.js";
import { embedDocumentChunks } from "./document-embedding.service.js";

export const processDocument = async (
  documentId: number
) => {
  console.log("PROCESS DOCUMENT CALLED:", documentId);
  const document =
    await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

  if (!document) {
    throw new Error("Document not found");
  }

  const text =
    await extractTextFromDocument(
      document.path,
      document.mimeType
    );

  const chunks = chunkText(text);

  await prisma.documentChunk.deleteMany({
    where: {
      documentId,
    },
  });

  if (chunks.length > 0) {
    await prisma.documentChunk.createMany({
      data: chunks.map(
        (content, index) => ({
          documentId,
          chunkIndex: index,
          content,
        })
      ),
  });

    await embedDocumentChunks(documentId);
  }

  return {
    documentId,
    characters: text.length,
    chunks: chunks.length,
  };
};