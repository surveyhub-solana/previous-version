'use client';
import { Transaction } from '@solana/web3.js';
import { Form } from './type';

export const createForm = async ({
  name,
  description,
  ownerPubkey,
}: {
  name: string;
  description: string;
  ownerPubkey: string;
}) => {
  const response = await fetch('/api/create-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      ownerPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    const base64Tx = data.transaction;
    const txBuffer = Buffer.from(base64Tx, 'base64');
    const tx = Transaction.from(txBuffer);
    return {
      tx: tx,
      id: data.id,
    };
  }
  console.error('Error:', data.message);
  return null;
};

export const getAllForms = async () => {
  try {
    const response = await fetch('/api/get-all-forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data as Form[];
    } else {
      // Trả về thông tin chi tiết lỗi từ server nếu có
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (error) {
    console.log(String(error));
    return null;
  }
};

export const getOwnForms = async (publicKey: string) => {
  try {
    const response = await fetch('/api/get-own-forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publicKey.toString()), // Ensure the publicKey is wrapped in an object
    });

    const data = await response.json();

    if (response.ok) {
      return data as Form[];
    } else {
      // Trả về thông tin chi tiết lỗi từ server nếu có
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else console.log(String(error));
    return null;
  }
};
export const getStats = async (publicKey: string, id = '') => {
  try {
    const response = await fetch('/api/get-own-forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publicKey), // Ensure the publicKey is wrapped in an object
    });

    const data = await response.json();

    if (response.ok) {
      const visits = data.reduce(
        (total: number, form: Form) =>
          total + ((id.length > 0 ? form.id === id : true) ? form.visits : 0),
        0
      );
      const submissions = data.reduce(
        (total: number, form: Form) =>
          total +
          ((id.length > 0 ? form.id === id : true) ? form.submissions : 0),
        0
      );
      const submissionRate = visits !== 0 ? (submissions * 100) / visits : 0;
      const bounceRate = visits !== 0 ? 100 - submissionRate : 0;

      return {
        visits,
        submissions,
        submissionRate,
        bounceRate,
      };
    } else {
      // Trả về thông tin chi tiết lỗi từ server nếu có
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log({
        status: 'error',
        message: error.message,
      });
      return null;
    }
    console.log({
      status: 'error',
      message: String(error),
    });
    return null;
  }
};
export const getFormByOwner = async ({
  id,
  ownerPubkey,
}: {
  id: string;
  ownerPubkey: string;
}) => {
  try {
    const response = await fetch('/api/get-form-by-owner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ownerPubkey,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      return data as Form;
    } else {
      // Trả về thông tin chi tiết lỗi từ server nếu có
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else console.log(String(error));
    return null;
  }
};

export const getForm = async (id: string) => {
  try {
    const response = await fetch('/api/get-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id.toString()),
    });

    const data = await response.json();

    if (response.ok) {
      return data as Form;
    } else {
      // Trả về thông tin chi tiết lỗi từ server nếu có
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else console.log(String(error));
    return null;
  }
};

export const updateFormContent = async ({
  id,
  new_content,
  ownerPubkey,
}: {
  id: string;
  new_content: string;
  ownerPubkey: string;
}) => {
  const response = await fetch('/api/update-form-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      new_content,
      ownerPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    const base64Tx = data.transaction;
    const txBuffer = Buffer.from(base64Tx, 'base64');
    const tx = Transaction.from(txBuffer);
    return {
      tx: tx,
      id: data.id,
    };
  }
  console.error('Error:', data.message);
  return null;
};
export const updateFormSOL = async ({
  id,
  sum_sol,
  sol_per_user,
  token_address,
  ownerPubkey,
}: {
  id: string;
  sum_sol: number;
  sol_per_user: number;
  token_address: string;
  ownerPubkey: string;
}) => {
  const response = await fetch('/api/update-form-sol', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      sum_sol,
      sol_per_user,
      token_address,
      ownerPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    const base64Tx = data.transaction;
    const txBuffer = Buffer.from(base64Tx, 'base64');
    const tx = Transaction.from(txBuffer);
    return {
      tx: tx,
      id: data.id,
    };
  }
  console.error('Error:', data.message);
  return null;
};

export const publishForm = async ({
  id,
  ownerPubkey,
}: {
  id: string;
  ownerPubkey: string;
}) => {
  const response = await fetch('/api/publish-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      ownerPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return data.id;
  }
  console.error('Error:', data.message);
  return null;
};
export const getFormWithSubmissions = async ({
  id,
  ownerPubkey,
}: {
  id: string;
  ownerPubkey: string;
}) => {
  const response = await fetch('/api/get-form-with-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      ownerPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return {
      form: data.form,
      submissions: data.submissions,
    };
  }
  console.error('Error:', data.message);
  return null;
};
export const submitForm = async ({
  id,
  content,
  authorPubkey,
}: {
  id: string;
  content: string;
  authorPubkey: string;
}) => {
  const response = await fetch('/api/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      content,
      authorPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    const base64Tx = data.transaction;
    const txBuffer = Buffer.from(base64Tx, 'base64');
    const tx = Transaction.from(txBuffer);
    return {
      tx: tx,
      id: data.id,
    };
  }
  console.error('Error:', data.message);
  return null;
};
export const deleteForm = async ({
  id,
  ownerPubkey,
}: {
  id: string;
  ownerPubkey: string;
}) => {
  const response = await fetch('/api/delete-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      ownerPubkey,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    const base64Tx = data.transaction;
    const txBuffer = Buffer.from(base64Tx, 'base64');
    const tx = Transaction.from(txBuffer);
    return tx;
  }
  console.error('Error:', data.message);
  return null;
};
