import { decode, encode } from 'bs58';
import { gunzipSync, gzipSync } from 'zlib';

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
