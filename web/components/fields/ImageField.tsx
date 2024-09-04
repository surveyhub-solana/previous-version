import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from '../FormElements';
import { z } from 'zod';
import useDesigner from '../hooks/useDesigner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { IoIosImages } from 'react-icons/io';
import { Textarea } from '../ui/textarea';

const type: ElementsType = 'ImageField';
const extraAttributes = {
  url: 'https://surveyhub.tech/favicon.ico',
  description: 'SurveyHub',
};
const propertiesSchema = z.object({
  url: z.string().url('Image must be a valid URL.'),
  description: z.string().max(2000),
});

export const ImageFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: IoIosImages,
    label: 'Image Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
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
  const { url, description } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <div>
        <Label className="text-muted-foreground">
          Image URL(Please click on Preview to view the image):
        </Label>
        <Input value={url} readOnly disabled />
      </div>
      <div className="w-full truncate whitespace-pre-line line-clamp-1">
        {description}
      </div>
    </div>
  );
}
function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { url, description } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full flex items-center justify-center">
        <img src={url} className="w-2/3" alt="" />
      </div>
      <div className="w-full whitespace-pre-line">{description}</div>
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      url: element.extraAttributes.url,
      description: element.extraAttributes.description,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { url, description } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        url,
        description,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description for Image:</FormLabel>
              <FormControl>
                <Textarea
                  rows={19}
                  placeholder={'Description for Image...'}
                  onChange={(e) => {
                    console.log(field.value.toString());
                    field.onChange(e.target.value);
                  }}
                  //   onKeyDown={(e) => {
                  //     if (e.key === 'Enter') e.currentTarget.blur();
                  //   }}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
