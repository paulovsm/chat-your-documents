// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { makeChain } from './util';
import { send } from 'process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const dir = path.resolve(process.cwd(), 'db/faiss_index');
  let chainResponse: any = {};

  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: "legalbrainembedding", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
  });

  const vectorstore = await FaissStore.loadFromPython(dir, embeddings);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    // Important to set no-transform to avoid compression, which will delay
    // writing response chunks to the client.
    // See https://github.com/vercel/next.js/issues/9965
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendData = (data: string) => {
    if (data === '[DONE]') {
      let sourceDocumentsList = [];
      let sourceDocumentsSet = new Set();
      for (let doc of chainResponse.sourceDocuments) {
        // Get the source document and remove the trailing '../source_documents/'
        const sourceDoc = doc["metadata"]["source"].replace('../source_documents/', '');
        if (!sourceDocumentsSet.has(sourceDoc)) {
          sourceDocumentsSet.add(sourceDoc);
          sourceDocumentsList.push({ doc: sourceDoc });
        } else {
          continue;
        }
      }
      let finalData = '[DONE]';
      let docData = "Source Documents: ";

      sourceDocumentsList.forEach(item => {
        docData = docData + "1. " + item.doc + " ";
      });

      finalData = finalData + docData;

      res.write(`data: ${finalData}\n\n`);

    } else {
      res.write(`data: ${data}\n\n`);
    }
  };

  sendData(JSON.stringify({ data: '' }));

  const chain = makeChain(vectorstore, (token: string) => {
    sendData(JSON.stringify({ data: token }));
  });

  try {
    chainResponse = await chain.call({
      question: body.question,
      chat_history: body.history,
    });
  } catch (err) {
    console.error(err);
    // Ignore error
  } finally {
    sendData('[DONE]');
    res.end();
  }
}
