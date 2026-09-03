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

    let text = result.text;

    // Fix common PDF encoding artifacts
    text = text
      .replace(/\u0083/g, "")
      .replace(/ΓÇó/g, "•")
      .replace(/ΓÇö/g, "—");

    // Join words that were split across PDF line breaks.
    // Example:
    // Experie
    // nce
    // becomes:
    // Experience
    text = text.replace(
      /([A-Za-z])\n([a-z])/g,
      "$1$2"
    );

    // Normalize line endings
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    // Remove excessive spaces
    text = text.replace(/[ \t]+/g, " ");

    // Remove excessive blank lines
    text = text.replace(/\n{3,}/g, "\n\n");

    return text.trim();
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