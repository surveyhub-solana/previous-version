import { v4 as uuidv4 } from 'uuid';
export function idGenerator(): string {
  const uniqueId = uuidv4();
  return uniqueId;
}
