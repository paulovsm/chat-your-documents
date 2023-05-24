#Chat with your documents

This repo is an implementation of a locally hosted chatbot specifically focused on question answering over documents of different formats.

Built with [LangChain](https://github.com/hwchase17/langchain/).

The app leverages LangChain's streaming support and async API to update the page in real time for multiple users.

## Getting Started

First, create a new `.env` file from `.env.example` and add your OpenAI API key found [here](https://platform.openai.com/account/api-keys).

```bash
cp .env.example .env
```

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- `wget` (on macOS, you can install this with `brew install wget`)

Next, we'll need to load our data source.

### Data Ingestion

Data ingestion happens in two steps.

First, you should save your documents in `source_documents`folder. 

Different formats are supported:
- csv
- doc/docx
- enex (Evernote)
- eml (e-mail)
- epub
- html
- md
- odt
- pdf
- ppt/pptx
- txt

Next, install dependencies and run the ingestion script:

```bash
yarn
cd ingest
pip install -r requirements.txt
python ingest_docs.py
```

_Note: If on Node v16, use `NODE_OPTIONS='--experimental-fetch' yarn ingest`_

This will parse the data, split text, create embeddings, store them in a vectorstore, and
then save it to the `db/` directory.

We save it to a directory because we only want to run the (expensive) data ingestion process once.

The Next.js server relies on the presence of the `db/` directory. Please
make sure to run this before moving on to the next step.

### Running the Server

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploying the server

The production version of this repo is hosted on
[fly](https://chat-langchainjs.fly.dev/). To deploy your own server on Fly, you
can use the provided `fly.toml` and `Dockerfile` as a starting point.

## Inspirations

This repo borrows heavily from

- [ChatLangChain](https://github.com/hwchase17/chat-langchain) - for the backend and data ingestion logic
- [LangChain Chat NextJS](https://github.com/zahidkhawaja/langchain-chat-nextjs) - for the frontend.
