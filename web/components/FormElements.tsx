import { CheckboxFieldFormElement } from './fields/CheckboxField';
import { DateFieldFormElement } from './fields/DateField';
import { ImageFieldFormElement } from './fields/ImageField';
import { NumberFieldFormElement } from './fields/NumberField';
import { ParagprahFieldFormElement } from './fields/ParagraphField';
import { RadioFieldFormElement } from './fields/RadioField';
import { SectionFieldFormElement } from './fields/SectionField';
import { SelectFieldFormElement } from './fields/SelectField';
import { SeparatorFieldFormElement } from './fields/SeparatorField';
import { SpacerFieldFormElement } from './fields/SpacerField';
import { SubTitleFieldFormElement } from './fields/SubTitleField';
import { TextAreaFormElement } from './fields/TextAreaField';
import { TextFieldFormElement } from './fields/TextField';
import { TitleFieldFormElement } from './fields/TitleField';

export type ElementsType =
  | 'TextField'
  | 'TitleField'
  | 'SubTitleField'
  | 'ParagraphField'
  | 'SeparatorField'
  | 'SpacerField'
  | 'NumberField'
  | 'TextAreaField'
  | 'DateField'
  | 'SelectField'
  | 'CheckboxField'
  | 'ImageField'
  | 'RadioField'
  | 'SectionField';

export type SubmitFunction = (key: string, value: string) => void;

export type FormDataType = {
  author: string;
  createAt: string;
  content: string;
};

export type FormElement = {
  type: ElementsType;

  construct: (id: string) => FormElementInstance;

  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  answerComponent: React.FC<{
    elementInstance: FormElementInstance;
    answers?: string[];
  }>;
  dataComponent?: React.FC<{
    data: FormDataType[];
    elementInstance: FormElementInstance;
  }>;

  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};
export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagprahFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  ImageField: ImageFieldFormElement,
  RadioField: RadioFieldFormElement,
  SectionField: SectionFieldFormElement,
};

export const FieldElements = [
  'TextField',
  'NumberField',
  'TextAreaField',
  'DateField',
  'SelectField',
  'CheckboxField',
  'RadioField',
];
export const LayoutElements = [
  'TitleField',
  'SubTitleField',
  'ParagraphField',
  'SeparatorField',
  'SpacerField',
  'ImageField',
  'SectionField',
];
export const checkValidSection = (
  elements: FormElementInstance[],
  index: number
) => {
  return elements.slice(0, index).reduce((total, element) => {
    return (
      LayoutElements.includes(element.type) &&
      total &&
      element.type != 'SectionField'
    );
  }, true);
};
