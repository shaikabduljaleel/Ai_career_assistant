import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const extractTextFromDocument = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  const buffer = await fs.readFile(filePath);

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    return result.text;
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result =
      await mammoth.extractRawText({
        buffer,
      });

    return result.value;
  }

  if (mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }

  throw new Error(
    `Unsupported document type: ${mimeType}`
  );
};