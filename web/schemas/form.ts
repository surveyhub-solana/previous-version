import { z } from 'zod';
import * as bs58 from 'bs58'; // Base58 library to validate the address format

export const formSchema = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters long'),
  description: z.string().min(1, 'Description is required'),
});

export type formSchemaType = z.infer<typeof formSchema>;

export const updateFormSchema = z.object({
  sumSOL: z.string().refine((value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0;
  }, 'The total number of lamports must be a valid non-negative number'),
  SOLPerUser: z.string().refine((value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0;
  }, 'The number of lamports per respondent must be a valid non-negative number'),
  tokenAddress: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true; // Optional, so pass if undefined
      try {
        const decoded = bs58.decode(value);
        return decoded.length === 32; // Solana public keys are 32 bytes long when decoded
      } catch (e) {
        return false;
      }
    }, 'Token address must be a valid Solana address'),
  checkAdvanced: z.boolean(),
});

export type updateFormSchemaType = z.infer<typeof updateFormSchema>;
