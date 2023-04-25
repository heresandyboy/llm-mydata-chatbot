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
    await runPinecone();
  } else if (useWeaviate) {
    await runWeaviate();
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
