import { FormElement, FormElementInstance } from '@/components/FormElements';
import {
  ActionParameter,
  ActionParameterSelectable,
  ActionParameterType,
} from '@solana/actions';
type SelectableParameterType = 'select' | 'radio' | 'checkbox';

export type TypedActionParameter<
  T extends ActionParameterType = ActionParameterType
> = T extends SelectableParameterType
  ? ActionParameterSelectable<T>
  : ActionParameter<T>;

export const validType: {
  title: string;
  type: ActionParameterType;
  class: 'general' | 'selectable';
  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
}[] = [
  {
    title: 'TextField',
    type: 'text',
    class: 'general',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (element.extraAttributes.required) {
        return currentValue.length > 0;
      }

      return true;
    },
  },
  {
    title: 'TextAreaField',
    type: 'textarea',
    class: 'general',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (element.extraAttributes.required) {
        return currentValue.length > 0;
      }

      return true;
    },
  },
  {
    title: 'NumberField',
    type: 'number',
    class: 'general',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (element.extraAttributes.required) {
        return currentValue.length > 0;
      }

      return true;
    },
  },
  {
    title: 'DateField',
    type: 'date',
    class: 'general',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (element.extraAttributes.required) {
        return currentValue.length > 0;
      }

      return true;
    },
  },
  {
    title: 'SelectField',
    type: 'select',
    class: 'selectable',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (element.extraAttributes.required) {
        return currentValue.length > 0;
      }

      return true;
    },
  },
  {
    title: 'CheckboxField',
    type: 'checkbox',
    class: 'selectable',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (!currentValue && element.extraAttributes.required) return false;
      const array_answers: string[] = JSON.parse(currentValue);
      if (element.extraAttributes.required) {
        if (array_answers.length < 1) return false;

        if (
          element.extraAttributes.options[
            element.extraAttributes.options.length - 1
          ] == 'input-other'
        )
          return array_answers.reduce((total, answer) => {
            return total && answer.length > 0;
          }, true);
        else
          return array_answers.reduce((total, answer) => {
            return total && element.extraAttributes!.options.includes(answer);
          }, true);
      }

      return true;
    },
  },
  {
    title: 'RadioField',
    type: 'radio',
    class: 'selectable',
    validate: (
      formElement: FormElementInstance,
      currentValue: string
    ): boolean => {
      const element = formElement;
      if (!element.extraAttributes) return false;
      if (element.extraAttributes.required) {
        if (
          element.extraAttributes.options[
            element.extraAttributes.options.length - 1
          ] == 'input-other'
        )
          return currentValue.length > 0;
        else return element.extraAttributes.options.includes(currentValue);
      }
      return true;
    },
  },
];

const createFormGeneral = (
  field: FormElementInstance
): ActionParameter<ActionParameterType> => {
  return {
    name: field.id,
    label: field.extraAttributes?.label || '',
    required: field.extraAttributes?.required || false,
    type: validType.find((item) => item.title === field.type)?.type || 'text',
  };
};

const createFormSelectable = (
  field: FormElementInstance
): ActionParameterSelectable<SelectableParameterType> => {
  return {
    name: field.id,
    label: field.extraAttributes?.label || '',
    required: field.extraAttributes?.required || false,
    type: (validType.find((item) => item.title === field.type)?.type ||
      'select') as SelectableParameterType,
    options:
      field.extraAttributes?.options.map((option: string) => {
        return {
          label: option == 'input-other' ? 'Other...' : option,
          value: option,
        };
      }) || [],
  };
};

export const createFormAction = (
  content: FormElementInstance[]
): TypedActionParameter[] => {
  const actionForm = content
    .map((field: FormElementInstance) => {
      if (
        validType.find((item) => item.title === field.type)?.class === 'general'
      ) {
        return createFormGeneral(field) as TypedActionParameter;
      } else if (
        validType.find((item) => item.title === field.type)?.class ===
        'selectable'
      ) {
        return createFormSelectable(field) as TypedActionParameter;
      } else {
        return undefined;
      }
    })
    .filter((item) => item !== undefined) as TypedActionParameter[];
  return actionForm;
};

const checkValidAnswer = (
  content: FormElementInstance[],
  answers: { [key: string]: string }
) => {
  for (const field of content) {
    const FormElement = validType.find((item) => item.title === field.type);
    if (!FormElement) continue;
    const actualValue = answers[field.id] || '';
    const valid = FormElement.validate(field, actualValue);
    if (!valid) return false;
  }

  return true;
};

export const handleAnswers = (
  content: FormElementInstance[],
  answers: { [key: string]: unknown }
) => {
  const newAnswers: { [key: string]: string } = {};
  for (const keyAnswer in answers) {
    if (typeof answers[keyAnswer] !== 'string') {
      newAnswers[keyAnswer] = JSON.stringify(answers[keyAnswer]);
    } else {
      newAnswers[keyAnswer] = answers[keyAnswer] as string;
    }
  }
  const isValid = checkValidAnswer(content, newAnswers);
  if (!isValid) return null;
  return newAnswers;
};
