'use client';

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from '../FormElements';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import useDesigner from '../hooks/useDesigner';
import { IoMdCheckbox } from 'react-icons/io';
import { Button } from '../ui/button';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { toast } from '../ui/use-toast';
import { Separator } from '../ui/separator';

const type: ElementsType = 'CheckboxField';

const extraAttributes = {
  label: 'Checkbox field',
  helperText: 'Helper text',
  required: false,
  options: [] as string[],
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(1000),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  options: z.array(z.string()).default([]),
});

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: 'CheckBox Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    const array_answers: string[] = JSON.parse(currentValue);
    if (element.extraAttributes.required) {
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
          return total && element.extraAttributes.options.includes(answer);
        }, true);
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
  const { label, required, helperText, options } = element.extraAttributes;
  return (
    <div className="flex flex-col items-top">
      <Label className="leading-relaxed">
        {label}
        {required && '*'}
      </Label>
      {options.map((option, index) => {
        return (
          <div
            key={`${element.id}-${index}-div`}
            className="gap-1.5 flex h-9 items-center"
          >
            <Checkbox
              id={`${element.id}-${index}`}
              key={`${element.id}-${index}-checkbox`}
            />
            {option == 'input-other' && index == options.length - 1 ? (
              <Input
                key={`${element.id}-${index}-label`}
                type="text"
                placeholder="Other..."
                className="border-b-2 border-t-0 border-r-0 border-l-0 focus-visible:ring-0"
              />
            ) : (
              <Label
                htmlFor={`${element.id}-${index}`}
                key={`${element.id}-${index}-label`}
              >
                {option}
              </Label>
            )}
          </div>
        );
      })}
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValues,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValues?: string[];
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAttributes;
  const [values, setValues] = useState<boolean[]>(() => {
    if (defaultValues == null) {
      // If defaultValues is null, return an array of 'false' with the same length as 'options'
      return Array(options.length).fill(false);
    } else {
      // Map defaultValues to boolean values, then fill remaining slots with 'false'
      const defaultMappedValues = defaultValues.map(
        (defaultValue) => defaultValue === 'true'
      );
      const remainingFalseValues = Array(
        options.length - defaultMappedValues.length
      ).fill(false);
      // Concatenate the mapped values and the remaining 'false' values
      return [...defaultMappedValues, ...remainingFalseValues];
    }
  });
  const [stringValues, setStringValues] = useState<string[]>(() => {
    const optionValues = [...options];
    if (options[options.length - 1] == 'input-other')
      optionValues[optionValues.length - 1] = '';
    return optionValues;
  });

  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  return (
    <div className="flex flex-col items-top">
      <Label className={`${cn(error && 'text-red-500')} leading-relaxed`}>
        {label}
        {required && '*'}
      </Label>
      {options.map((option, index) => {
        return (
          <div
            key={`${element.id}-${index}-div`}
            className="gap-1.5 flex h-9 items-center"
          >
            <Checkbox
              id={`${element.id}-${index}`}
              key={`${element.id}-${index}-checkbox`}
              checked={values[index]}
              onCheckedChange={async (checked) => {
                let value = false;
                if (checked == true) value = true;
                const newValues = [...values];
                newValues[index] = value; // do useState không diễn ra ngay lập tức mà lập lịch render nên nếu dùng dữ liệu luôn sẽ là data cũ
                setValues((prevValues) => {
                  const newValues = [...prevValues]; // Create a copy of the current array
                  newValues[index] = value; // Update the value at the specified index (you can set it to true/false or toggle it)
                  return newValues; // Return the updated array
                });
                if (!submitValue) return;
                const filteredArray = stringValues.filter(
                  (item, index) => item !== '' && newValues[index] == true
                ); // Filter out empty strings
                const resultString = JSON.stringify(filteredArray); // Convert the array to string format
                const valid = CheckboxFieldFormElement.validate(
                  element,
                  resultString
                );
                setError(!valid);
                submitValue(element.id, resultString);
              }}
            />
            {option == 'input-other' && index == options.length - 1 ? (
              <Input
                key={`${element.id}-${index}-label`}
                type="text"
                placeholder="Other..."
                className={`${cn(
                  error && 'text-red-500 border-b-red-500'
                )} border-b-2 border-t-0 border-r-0 border-l-0 focus-visible:ring-0`}
                onChange={(e) => {
                  const newValues = [...values];
                  newValues[index] = true; // do useState không diễn ra ngay lập tức mà lập lịch render nên nếu dùng dữ liệu luôn sẽ là data cũ
                  setValues((prevValues) => {
                    const newValues = [...prevValues]; // Create a copy of the current array
                    newValues[index] = true; // Update the value at the specified index (you can set it to true/false or toggle it)
                    return newValues; // Return the updated array
                  });
                  const newStringValue = [...stringValues];
                  newStringValue[newStringValue.length - 1] = e.target.value;
                  setStringValues((preStringValues) => {
                    const newStringValue = [...preStringValues];
                    newStringValue[newStringValue.length - 1] = e.target.value;
                    return newStringValue;
                  });
                  if (!submitValue) return;
                  const filteredArray = newStringValue.filter(
                    (item, index) => item !== '' && newValues[index] == true
                  ); // Filter out empty strings
                  const resultString = JSON.stringify(filteredArray); // Convert the array to string format
                  const valid = CheckboxFieldFormElement.validate(
                    element,
                    resultString
                  );
                  setError(!valid);
                  submitValue(element.id, resultString);
                }}
              />
            ) : (
              <Label
                htmlFor={`${element.id}-${index}`}
                key={`${element.id}-${index}-label`}
                className={
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                }
                onClick={() =>
                  setValues((prevValues) => {
                    const newValues = [...prevValues]; // Create a copy of the current array
                    newValues[index] = !newValues[index]; // Update the value at the specified index (you can set it to true/false or toggle it)
                    return newValues; // Return the updated array
                  })
                }
              >
                {option}
              </Label>
            )}
            <hr key={`${element.id}-${index}-hr`} />
          </div>
        );
      })}
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
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
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      options: element.extraAttributes.options,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required, options } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        options,
      },
    });
    toast({
      title: 'Success',
      description: 'Properties saved successfully',
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
                <Button
                  variant={'outline'}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault(); // avoid submit
                    form.setValue(
                      'options',
                      field.value[field.value.length - 1] === 'input-other'
                        ? [
                            ...field.value.slice(0, -1),
                            'New option',
                            'input-other',
                          ] // Chèn vào kế cuối nếu phần tử cuối là 'input-other'
                        : field.value.concat('New option') // Chèn vào cuối nếu không phải 'input-other'
                    );
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch('options').map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option != 'input-other' ? option : 'Other...'}
                      readOnly={option == 'input-other'}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = [...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>

              <FormDescription className="flex">
                {field.value[field.value.length - 1] != 'input-other' && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault(); // avoid submit
                      form.setValue(
                        'options',
                        field.value.concat('input-other')
                      );
                    }}
                    variant={'link'}
                    className="ms-auto me-0 px-0 text-xs underline py-0 h-fit"
                  >
                    Add Other
                  </Button>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br />
                  It will be displayed below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <Button className="w-full" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
