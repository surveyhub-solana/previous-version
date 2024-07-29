import { Idl } from '@project-serum/anchor';

export const IDL: Idl = {
  version: '0.1.0',
  name: 'solana_program',
  instructions: [
    {
      name: 'createForm',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'owner', isMut: true, isSigner: true },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
      ],
    },
    {
      name: 'updateFormContent',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'owner', isMut: true, isSigner: true },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [
        { name: 'id', type: 'string' },
        { name: 'newContent', type: 'string' },
      ],
    },
    {
      name: 'updateFormSol',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'owner', isMut: true, isSigner: true },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [
        { name: 'sumSol', type: 'u64' },
        { name: 'solPerUser', type: 'u64' },
      ],
    },
    {
      name: 'publishForm',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'owner', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: 'submitForm',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'formSubmission', isMut: true, isSigner: false },
        { name: 'author', isMut: true, isSigner: true },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [
        { name: 'content', type: 'string' },
        { name: 'submissionId', type: 'string' },
      ],
    },
    {
      name: 'deleteForm',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'owner', isMut: true, isSigner: true },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: 'visitForm',
      accounts: [
        { name: 'form', isMut: true, isSigner: false },
        { name: 'system', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'FormSubmissions',
      type: {
        kind: 'struct',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'formId', type: 'publicKey' },
          { name: 'author', type: 'publicKey' },
          { name: 'createdAt', type: 'i64' },
          { name: 'content', type: 'string' },
        ],
      },
    },
    {
      name: 'Form',
      type: {
        kind: 'struct',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'system', type: 'publicKey' },
          { name: 'owner', type: 'publicKey' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'createdAt', type: 'i64' },
          { name: 'content', type: 'string' },
          { name: 'visits', type: 'u32' },
          { name: 'submissions', type: 'u32' },
          { name: 'sumSol', type: 'u64' },
          { name: 'remainSol', type: 'u64' },
          { name: 'solPerUser', type: 'u64' },
          { name: 'published', type: 'bool' },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: 'InvalidInput', msg: 'Invalid input data provided.' },
    { code: 6001, name: 'Unauthorized', msg: 'Unauthorized action.' },
    {
      code: 6002,
      name: 'FormCannotBeEdited',
      msg: 'This form cannot be edited.',
    },
    { code: 6003, name: 'TransferFailed', msg: 'Failed to transfer SOL.' },
    { code: 6004, name: 'UnavailableBalance', msg: 'Unavailable balance.' },
  ],
};