import {
  createActionHeaders,
  ActionGetResponse,
  ActionError,
} from '@solana/actions';
const headers = createActionHeaders();
export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const requestUrl = new URL(req.url);
    const baseHref = new URL(
      `/api/actions/submit-form/${params.formId}`,
      requestUrl.origin
    ).toString();
    const payload: ActionGetResponse = {
      type: 'action',
      title: 'Form Submit',
      icon: new URL('/branding/LOGO.png', requestUrl.origin).toString(),
      description: 'Transfer SOL to another Solana wallet',
      label: 'Transfer', // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: 'Hello', // button text
            href: baseHref,
            parameters: [
              {
                name: 'name',
                label: `First Name ${params.formId}`,
                required: true,
                type: 'text',
              },
              {
                name: 'name2',
                label: `Last Name ${params.formId}`,
                required: true,
                type: 'text',
              },
            ],
            type: 'transaction',
          },
          {
            label: 'Submit', // button text
            href: baseHref,
            parameters: [
              {
                name: 'firstName',
                label: `First Name ${params.formId}`,
                required: true,
                type: 'text',
              },
              {
                name: 'lastName',
                label: `Last Name ${params.formId}`,
                required: true,
                type: 'text',
              },
            ],
            type: 'transaction',
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (error) {
    console.error(error);
    const actionError: ActionError = { message: 'An unknown error occurred' };
    if (typeof error == 'string') actionError.message = error;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
}
export const OPTIONS = async () => Response.json(null, { headers });
