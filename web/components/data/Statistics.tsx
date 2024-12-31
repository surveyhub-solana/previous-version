import { Form, FormSubmissions } from '@/app/services/type';
import { FormElementInstance, FormElements } from '../FormElements';

export default function Statistics({
  form,
  submissions,
}: {
  form: Form;
  submissions: FormSubmissions[];
}) {
  const data = submissions.map((submission) => {
    return {
      author: submission.author.toString(),
      createAt: submission.createdAt,
      content: submission.content,
    };
  });
  const questions = JSON.parse(form.content) as FormElementInstance[];
  return (
    <div className="w-full h-full rounded-[0.5rem] bg-secondary p-3">
      {questions.map((question) => {
        const DataComponent = FormElements[question.type]?.dataComponent;
        if (!DataComponent) return;
        const dataField = data.map((item) => ({
          ...item,
          content: JSON.parse(item.content)[question.id],
        }));
        return (
          <DataComponent
            key={question.id}
            data={dataField}
            elementInstance={question}
          />
        );
      })}
    </div>
  );
}
