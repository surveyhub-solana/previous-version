import { PublicKey } from '@solana/web3.js';

export type Form = {
  id: string; // 4 + id.len()
  system: PublicKey; // 32
  owner: PublicKey; // 32
  name: string; // 4 + name.len()
  description: string; // 4 + description.len()
  createdAt: string; // i64 in Rust, number in TS
  content: string; // 4 + len()
  visits: number; // u32 in Rust, number in TS
  submissions: number; // u32 in Rust, number in TS
  sumSol: number; // f64 in Rust, number in TS
  remainSol: number; // f64 in Rust, number in TS
  solPerUser: number; // f64 in Rust, number in TS
  published: boolean; // 1
};

export type FormSubmissions = {
  id: string; // 4 + len()
  formId: PublicKey; // 32
  author: PublicKey; // 32
  createdAt: string; // i64 in Rust, number in TS
  content: string; // 4 + len()
};