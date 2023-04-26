import { run as runPinecone } from './ingest-data-pinecone';
import { run as runWeaviate } from './ingest-data-weaviate';

const usePinecone = process.env.USE_PINECONE === 'true';
const useWeaviate = process.env.USE_WEAVIATE === 'true';

if (usePinecone && useWeaviate) {
  throw new Error(
    'Please set only one of USE_PINECONE or USE_WEAVIATE to true',
  );
}

if (!usePinecone && !useWeaviate) {
  throw new Error('Please set one of USE_PINECONE or USE_WEAVIATE to true');
}

const run = async () => {
  if (usePinecone) {
    if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
      throw new Error('Pinecone environment or api key vars missing');
    }
    console.log('Selected Pinecone');
    await runPinecone();
  } else if (useWeaviate) {
    if (!process.env.WEAVIATE_HOST || !process.env.WEAVIATE_SCHEME) {
      throw new Error('Weaviate environment or api key vars missing');
    }
    console.log('Selected Weaviate');
    await runWeaviate();
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
