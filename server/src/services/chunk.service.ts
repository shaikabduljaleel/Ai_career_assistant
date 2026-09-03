const DEFAULT_CHUNK_SIZE = 800;
const DEFAULT_OVERLAP = 100;

const SECTION_HEADINGS = [
  "Professional Summary",
  "Education",
  "Technical Skills",
  "Professional Experience",
  "Engineering Projects",
  "Certifications",
];

export const chunkText = (
  text: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP
): string[] => {
  let cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u0083/g, "")
    .replace(/ΓÇö/g, "—")
    .replace(/ΓÇó/g, "•")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanedText) {
    return [];
  }

  // Create boundaries around major resume sections.
  for (const heading of SECTION_HEADINGS) {
    const escaped =
      heading.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    cleanedText = cleanedText.replace(
      new RegExp(`\\s*(${escaped})`, "gi"),
      "\n\n$1"
    );
  }

  const sections = cleanedText
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  let current = "";

  for (const section of sections) {
    if (!current) {
      current = section;
      continue;
    }

    if (
      current.length +
        section.length +
        2 <=
      chunkSize
    ) {
      current += `\n\n${section}`;
      continue;
    }

    chunks.push(current.trim());

    // Word-safe overlap
    const words = current.split(/\s+/);

    let overlapText = "";

    for (
      let i = words.length - 1;
      i >= 0;
      i--
    ) {
      const candidate =
        words.slice(i).join(" ");

      if (candidate.length > overlap) {
        break;
      }

      overlapText = candidate;
    }

    current =
      overlapText.length > 0
        ? `${overlapText}\n\n${section}`
        : section;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
};