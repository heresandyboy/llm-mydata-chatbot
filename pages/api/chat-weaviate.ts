import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { WeaviateStore } from 'langchain/vectorstores/weaviate';
import { makeChain } from '@/utils/makechain';
import { initWeaviate } from '@/utils/weaviate-client';
import { WEAVIATE_INDEX_NAME } from '@/config/weaviate';
import { WeaviateClient } from 'weaviate-ts-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;

  console.log('question', question);

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
  const client = await initWeaviate();

  try {
    /* create vectorstore*/
    const vectorStore = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        client,
        indexName: WEAVIATE_INDEX_NAME,
        textKey: 'text',
        metadataKeys: ['source', 'pdf_numpages', 'locFrom', 'locTo'],
      },
    );

    //create chain
    const chain = makeChain(vectorStore);
    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log('response', response);
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
