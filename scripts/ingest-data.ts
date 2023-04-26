import { run as runPinecone } from './ingest-data-pinecone';
import { run as runWeaviate } from './ingest-data-weaviate';
import { USE_PINECONE } from '@/config/pinecone';
import { USE_WEAVIATE } from '@/config/weaviate';

if (USE_PINECONE && USE_WEAVIATE) {
  throw new Error(
    'Please set only one of USE_PINECONE or USE_WEAVIATE to true',
  );
}

if (!USE_PINECONE && !USE_WEAVIATE) {
  throw new Error('Please set one of USE_PINECONE or USE_WEAVIATE to true');
}

const run = async () => {
  if (USE_PINECONE) {
    console.log('Selected Pinecone');
    await runPinecone();
  } else if (USE_WEAVIATE) {
    console.log('Selected Weaviate');
    await runWeaviate();
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
