import { FormElementInstance } from '@/components/FormElements';
import { decode, encode } from 'bs58';
import { gunzipSync, gzipSync } from 'zlib';
import { idGenerator } from './idGenerator';

export const compressedContent = (content: string): string => {
  try {
    const compressed = gzipSync(content);
    const compressedBase64 = encode(compressed);
    return compressedBase64;
  } catch (error) {
    console.error('Error compressing content:', error);
    throw error;
  }
};

export const deCompressedContent = (content: string): string => {
  try {
    if (content == '[]') return content;
    const decompressed = gunzipSync(decode(content)).toString();
    return decompressed;
  } catch (error) {
    console.error('Error decompressing content:', error);
    throw error;
  }
};
export const handleOldContent = (content: string): string => {
  try {
    const oldContent: FormElementInstance[] = JSON.parse(content);
    const contentRemoveId = oldContent.map(({ id, ...rest }) => rest);
    return JSON.stringify(contentRemoveId);
  } catch (error) {
    console.error('Error handling old content:', error);
    throw error;
  }
};
type FormElementWithoutId = Omit<FormElementInstance, 'id'>;

export const handleNewContent = (content: string): string => {
  try {
    const newContent: FormElementWithoutId[] = JSON.parse(content);
    const contentAddId = newContent.map(({ ...rest }) => {
      return {
        ...rest,
        id: idGenerator(),
      };
    });
    return JSON.stringify(contentAddId);
  } catch (error) {
    console.error('Error handling new content:', error);
    throw error;
  }
};
