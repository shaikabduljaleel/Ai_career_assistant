import {
  generateEmbedding,
} from "./services/embedding.service.js";

const main = async () => {
  const text =
    "I am a full stack developer with experience in React, TypeScript, Node.js and PostgreSQL.";

  const embedding =
    await generateEmbedding(text);

  console.log(
    "Embedding dimensions:",
    embedding.length
  );

  console.log(
    "First 5 values:",
    embedding.slice(0, 5)
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});