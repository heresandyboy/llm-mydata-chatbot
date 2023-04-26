/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */

if (!process.env.WEAVIATE_INDEX_NAME) {
  throw new Error('Missing Weaviate index name in .env file');
}

const WEAVIATE_INDEX_NAME = process.env.WEAVIATE_INDEX_NAME ?? '';

const WEAVIATE_NAME_SPACE = 'pdf-test'; //namespace is optional for your vectors
const USE_WEAVIATE = process.env.NEXT_PUBLIC_USE_WEAVIATE === 'true';

export { WEAVIATE_INDEX_NAME, WEAVIATE_NAME_SPACE, USE_WEAVIATE };
