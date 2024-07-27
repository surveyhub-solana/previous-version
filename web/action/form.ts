"use server";
import prisma from "@/lib/prisma";
import {
  formSchema,
  formSchemaType,
  updateFormSchemaType,
} from "@/schemas/form";
import { PublicKey, Keypair } from "@solana/web3.js";

class UserNotFound extends Error {}

export default async function GetFormStats(
  publicKey: string,
  id = NaN
) {
  if (!publicKey) {
    throw new UserNotFound();
  }
  const pubKey = new PublicKey(publicKey);
  const stats = await prisma.form.aggregate({
    where: {
      AND: [!isNaN(id) ? { id: id } : {}, { userPubkey: pubKey?.toString() }],
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(publicKey: string, data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  if (!publicKey) {
    throw new UserNotFound();
  }

  const pubKey = new PublicKey(publicKey);

  const surveyAccount = Keypair.generate();

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userPubkey: pubKey?.toString(),
      name,
      description,
      surveyAccount: surveyAccount.publicKey?.toString(),
    },
  });

  if (!form) {
    throw new Error("something went wrong");
  }

  return form.id;
}

export async function GetForms(publicKey: string, id = NaN) {
  if (!publicKey) {
    throw new UserNotFound();
  }

  return await prisma.form.findMany({
    where: {
      AND: [!isNaN(id) ? { id: id } : {}, { userPubkey: publicKey }],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function UpdateFormContent(
  publicKey: string,
  id: number,
  jsonContent: string
) {
  if (!publicKey) {
    throw new UserNotFound();
  }

  return await prisma.form.update({
    where: {
      userPubkey: publicKey,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(publicKey: string, id: number) {
  if (!publicKey) {
    throw new UserNotFound();
  }

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userPubkey: publicKey,
      id,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(publicKey: string, id: number) {
  if (!publicKey) {
    throw new UserNotFound();
  }

  return await prisma.form.findUnique({
    where: {
      userPubkey: publicKey,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function GetSurveyAccountById(publicKey: string, id: number) {
  try {
    const form = await prisma.form.findUnique({
      where: {
        id: id,
        userPubkey: publicKey,
      },
      select: {
        surveyAccount: true,
      },
    });

    if (form) {
      return form.surveyAccount;
    } else {
      console.log("Form not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving survey account:", error);
    throw error;
  }
}
export async function UpdateForm(
  publicKey: string,
  id: number,
  data: updateFormSchemaType
) {
  if (!publicKey) {
    throw new UserNotFound();
  }
  try {
    let { sumSOL, SOLPerUser } = data;
    if(sumSOL == 0 || SOLPerUser == 0) {
      sumSOL = 0;
      SOLPerUser = 0;
    }
    const form = await prisma.form.update({
      where: {
        userPubkey: publicKey,
        id,
      },
      data: {
        sumSOL,
        SOLPerUser,
      },
    });
    if (form) {
      return form.id;
    } else {
      console.log("Form not found");
      return null;
    }
  } catch (error) {
    console.error("Error updating survey form data: ", error);
    throw error;
  }
}
