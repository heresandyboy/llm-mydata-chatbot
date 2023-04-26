import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { WeaviateStore } from 'langchain/vectorstores/weaviate';
import { initWeaviate } from '@/utils/weaviate-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { WEAVIATE_INDEX_NAME } from '@/config/weaviate';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

/* Name of directory to retrieve your files from */
const filePath = 'public/docs';

export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    const transformedDocuments = docs.map((doc) => {
      const locFrom = doc.metadata?.loc?.lines?.from?.toString();
      const locTo = doc.metadata?.loc?.lines?.to?.toString();

      if (locFrom && locTo) {
        const newMetadata: Record<string, any> = {
          ...doc.metadata,
          locFrom,
          locTo,
        };
        delete newMetadata.loc;

        return {
          ...doc,
          metadata: newMetadata,
        };
      }
      return doc;
    });

    console.log(JSON.stringify(transformedDocuments, null, 2));

    // console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const client = await initWeaviate();

    //embed the PDF documents
    const store = await WeaviateStore.fromDocuments(
      transformedDocuments,
      embeddings,
      {
        client,
        indexName: WEAVIATE_INDEX_NAME,
        textKey: 'text',
        metadataKeys: [
          'source',
          'pdf_numpages',
          'locFrom',
          'locTo',
          'chat_history',
        ],
      },
    );

    const results = await store.similaritySearch('engagement', 1);
    // const results2 = await store.similaritySearch(
    //   'decision makers spontaneously gave',
    //   1,
    //   {
    //     where: {
    //       operator: 'Like',
    //       path: ['source'],
    //       valueText:
    //         'C:\\code\\ai\\mine\\ai-experiments\\js\\complex\\query-pdfs\\public\\docs\\broadband-price-differentials.pdf',
    //     },
    //   },
    // );
    console.log('SEARCH RESULTS', results);
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

// (async () => {
//   await run();
//   console.log('ingestion complete');
// })();
