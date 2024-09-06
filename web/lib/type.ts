export interface IForm {
  name: string;
  description: string;
  owner: string;
  created_at: number;
  content: string;
  visits: number;
  submissions: number;
  published: boolean;
}

export interface IFormWithId extends IForm {
  _id: string;
}
export interface FormStats {
  visits: number;
  submissions: number;
  submissionRate: number;
  bounceRate: number;
}
export interface IFormSubmission {
  form_id: string;
  author: string;
  created_at: number;
  content: string;
}
export interface IFormSubmissionWithId extends IFormSubmission {
  _id: string;
}
