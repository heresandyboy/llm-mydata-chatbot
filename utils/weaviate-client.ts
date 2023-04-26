import weaviate, { WeaviateClient } from 'weaviate-ts-client';

async function initWeaviate() {
  if (!process.env.WEAVIATE_HOST || !process.env.WEAVIATE_SCHEME) {
    throw new Error('Weaviate environment or api key vars missing');
  }

  try {
    const client: WeaviateClient = weaviate.client({
      scheme: process.env.WEAVIATE_SCHEME || '',
      host: process.env.WEAVIATE_HOST || '',
    });

    return client;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Weaviate Client');
  }
}

// export const client = await initWeaviate();
export { initWeaviate };
