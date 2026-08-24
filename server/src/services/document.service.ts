import prisma from "../config/prisma.js";

export const createDocument = async (
  userId: number,
  data: {
    originalName: string;
    storedName: string;
    mimeType: string;
    size: number;
    path: string;
  }
) => {
  return prisma.document.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const getUserDocuments = async (
  userId: number
) => {
  return prisma.document.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteDocument = async (
  userId: number,
  documentId: number
) => {
  const document =
    await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

  if (!document) {
    throw new Error("Document not found");
  }

  await prisma.document.delete({
    where: {
      id: documentId,
    },
  });

  return document;
};