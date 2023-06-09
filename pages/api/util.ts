import { OpenAIChat } from 'langchain/llms/openai';
import { LLMChain, ConversationalRetrievalQAChain, loadQAChain } from 'langchain/chains';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { PromptTemplate } from 'langchain/prompts';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI executive assistant responsible for answering questions about business documents.
  You are given the following extracted parts of long documents and a question.
  Your task is to answer as faithfully as you can. While answering think step-by step and justify your answer.
  Provide a detailed answer so user don’t need to search outside to understand the answer.
  You should only use hyperlinks that are explicitly listed as a source in the context. Do NOT make up a hyperlink that is not listed.
  If you don't know the answer, just say "Hmm, I'm not sure." Don't try to make up an answer.
Question: {question}
=========
{context}
=========
Answer in Markdown:`
);

export const makeChain = (vectorstore: FaissStore, onTokenStream?: (token: string) => void) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ 
      temperature: 0,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
      maxTokens: 2048 }),
    prompt: CONDENSE_PROMPT,
  });

  const model = new OpenAIChat({
    temperature: 0,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    maxTokens: 2048,
    streaming: Boolean(onTokenStream),
    callbacks: [
      {
        handleLLMNewToken: onTokenStream,
      },
    ],
  });

  const docChain = loadQAChain(model, { type: 'stuff', prompt: QA_PROMPT });

  return new ConversationalRetrievalQAChain({
    retriever: vectorstore.asRetriever(),
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true
  });
};
