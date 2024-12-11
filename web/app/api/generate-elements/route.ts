import { generateElements } from '@/config/gemini';

export async function POST(req: Request) {
  try {
    const { userPrompt, oldContent, title, description } = await req.json();
    if (userPrompt.length == 0) {
      return new Response(JSON.stringify('User prompt is required!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    if(!title || !description){
      return new Response(JSON.stringify('Title and description are required!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    const form = await generateElements(userPrompt, oldContent, title, description);

    return new Response(JSON.stringify(form), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        error: 'Unknown error',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
}
