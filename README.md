![BlinkFinance README Hero image](./bf-readme-hero.jpg)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain`](https://www.npmjs.com/package/create-onchain).


## Getting Started

First, install dependencies:

```bash
npm install
```

Follow DATABASE_SETUP.md guide.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI API Key for invoice PDF extraction
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# JWT Secret for authentication
JWT_SECRET=your-secret-key-change-in-production

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/blinkfi-mini-app
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Invoice PDF Extraction
The app includes AI-powered invoice data extraction using OpenAI's GPT-4o-mini model. When you upload a PDF invoice, the system will:

1. Extract text from the PDF
2. Use ChatGPT to analyze and extract structured data
3. Return the following information in JSON format:
   - Invoice Number
   - E-Invoice Number (if present)
   - Issued Date (formatted as DD.MM.YYYY)
   - Due Date (formatted as DD.MM.YYYY)
   - Total Amount

**API Endpoint:** `POST /api/invoices/extract`

**Requirements:**
- Valid JWT authentication token
- PDF file (max 10MB)
- OpenAI API key configured in environment variables

**Usage:**
1. Navigate to the Upload page
2. Click "Upload PDF" to select a PDF file
3. Click "Extract Data" to process the invoice
4. View the extracted data in a structured format


