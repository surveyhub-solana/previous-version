'use client';

import { z } from 'zod';
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from '../FormElements';
import { Label } from '../ui/label';

import { RxSection } from 'react-icons/rx';

const type: ElementsType = 'SectionField';
const extraAttributes = {
  no: 1,
  total: 1,
};

const propertiesSchema = z.object({
  // no: z.number(),
});

export const SectionFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: RxSection,
    label: 'Section field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  answerComponent: FormComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { no, total } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground text-3xl font-black">
        Section: {no} / {total}
      </Label>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { no, total } = element.extraAttributes;
  return (
    <div className="flex h-full items-center justify-center gap-2 ms-auto me-0">
      <Label className="text-muted-foreground font-black">
        Section: {no} / {total}
      </Label>
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <p>No properties for this element</p>;
}
