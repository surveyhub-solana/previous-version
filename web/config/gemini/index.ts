import { GoogleGenerativeAI } from '@google/generative-ai';
import { promptForCreateForm } from './prompt';

import dotenv from 'dotenv';
import { handleNewContent, handleOldContent } from '@/lib/content';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const generateElements = async (
  userPrompt: string,
  oldContent: string,
  title: string,
  description: string
): Promise<string> => {
  const oldContentHandle = handleOldContent(oldContent);
  const prompt =
    promptForCreateForm +
    '\n\nIII. Information' +
    '\nForm title: ' +
    title +
    '\nForm description: ' +
    description +
    '\nOld Content: ' +
    oldContentHandle +
    '\nUser Prompr: ' +
    userPrompt;

  const result = await model.generateContent(prompt);

  const newContent = result.response.text().split('```json')[1].split('```')[0];
  const newContentHandle = handleNewContent(newContent);
  return newContentHandle;
};
