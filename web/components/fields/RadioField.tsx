'use client';

import {
  ElementsType,
  FormDataType,
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
import { IoMdRadioButtonOn } from 'react-icons/io';
import { Button } from '../ui/button';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import { cn, toSnakeCase } from '@/lib/utils';
import { toast } from '../ui/use-toast';
import { Separator } from '../ui/separator';

const type: ElementsType = 'RadioField';

const extraAttributes = {
  label: 'Radio field',
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

export const RadioFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: IoMdRadioButtonOn,
    label: 'Radio Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  answerComponent: AnswerComponent,
  dataComponent: DataComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
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
      <RadioGroup>
        {options.map((option, index) => {
          return (
            <div
              key={`${element.id}-${index}-div`}
              className="gap-1.5 flex h-9 items-center"
            >
              <RadioGroupItem
                id={`${element.id}-${index}`}
                key={`${element.id}-${index}-radio`}
                value={option}
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
      </RadioGroup>
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
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAttributes;
  const [value, setValue] = useState(defaultValue || 'null');
  const [selectedValue, setSelectedValue] = useState(() => {
    if (defaultValue != undefined && !options.includes(defaultValue))
      return defaultValue;
    return '';
  }); // Quản lý giá trị radio được chọn

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
      <RadioGroup
        value={value}
        onValueChange={(value) => {
          setValue(value);
          if (!submitValue) return;
          const valid = RadioFieldFormElement.validate(element, value);
          setError(!valid);
          submitValue(element.id, value);
        }}
        className="gap-0"
      >
        {options.map((option, index) => {
          return (
            <div
              key={`${element.id}-${index}-div`}
              className="gap-1.5 flex h-9 items-center"
            >
              <RadioGroupItem
                value={option == 'input-other' ? selectedValue : option}
                id={`${element.id}-${index}`}
                key={`${element.id}-${index}-checkbox`}
              />
              {option == 'input-other' && index == options.length - 1 ? (
                <>
                  <Label key={`${element.id}-${index}-label`}>Other</Label>
                  <Input
                    key={`${element.id}-${index}-input`}
                    value={selectedValue}
                    type="text"
                    placeholder="Other..."
                    className={`${cn(
                      error && 'text-red-500 border-b-red-500'
                    )} border-b-2 border-t-0 border-r-0 border-l-0 focus-visible:ring-0`}
                    onChange={(e) => {
                      setSelectedValue(e.target.value); // Cập nhật giá trị radio với giá trị của Input
                      setValue(e.target.value);
                      if (!submitValue) return;
                      const valid = RadioFieldFormElement.validate(
                        element,
                        e.target.value
                      );
                      setError(!valid);
                      submitValue(element.id, e.target.value);
                    }}
                  />
                </>
              ) : (
                <Label
                  htmlFor={`${element.id}-${index}`}
                  key={`${element.id}-${index}-label`}
                  className={`${cn(error && 'text-red-500')} cursor-pointer`}
                >
                  {option}
                </Label>
              )}
              <hr key={`${element.id}-${index}-hr`} />
            </div>
          );
        })}
      </RadioGroup>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function AnswerComponent({
  elementInstance,
  answers,
}: {
  elementInstance: FormElementInstance;
  answers?: string[];
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAttributes;
  const [value, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(''); // Quản lý giá trị radio được chọn

  // Sử dụng useEffect để cập nhật giá trị state sau khi render
  useEffect(() => {
    if (answers != undefined && answers.length > 0) {
      if (options.includes(answers[0])) {
        setValue(answers[0]);
      } else {
        setSelectedValue(answers[0]);
        setValue(answers[0]);
      }
    }
  }, [answers, options]);

  return (
    <div className="flex flex-col items-top">
      <Label className={`leading-relaxed`}>
        {label}
        {required && '*'}
      </Label>
      <RadioGroup value={value} aria-readonly className="gap-0">
        {options.map((option, index) => {
          return (
            <div
              key={`${element.id}-${index}-div`}
              className="gap-1.5 flex h-9 items-center"
            >
              <RadioGroupItem
                value={option === 'input-other' ? selectedValue : option}
                id={`${element.id}-${index}`}
                key={`${element.id}-${index}-checkbox`}
              />
              {option === 'input-other' && index === options.length - 1 ? (
                <>
                  <Label key={`${element.id}-${index}-label`}>Other</Label>
                  <Input
                    key={`${element.id}-${index}-input`}
                    type="text"
                    placeholder="Other..."
                    className="border-b-2 border-t-0 border-r-0 border-l-0 focus-visible:ring-0"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                  />
                </>
              ) : (
                <Label
                  htmlFor={`${element.id}-${index}`}
                  key={`${element.id}-${index}-label`}
                >
                  {option}
                </Label>
              )}
              <hr key={`${element.id}-${index}-hr`} />
            </div>
          );
        })}
      </RadioGroup>
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

const generateChartConfig = (options: string[]) => {
  // Danh sách màu có sẵn
  const baseColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const result: { [key: string]: { label: string; color: string } } = {};

  options.forEach((option, index) => {
    const colorIndex = index % (baseColors.length - 1);
    result[toSnakeCase(option)] = {
      label:
        option === 'input-other'
          ? 'Other'
          : option.charAt(0).toUpperCase() + option.slice(1), // Capitalize label
      color: baseColors[colorIndex],
    };
  });

  return result;
};

function DataComponent({
  data,
  elementInstance,
}: {
  data: FormDataType[];
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { options } = element.extraAttributes;
  if (!options) return <></>;
  const answersMap = new Map<
    string,
    {
      total: number;
      details: { author: string; createAt: string; answer: string }[];
    }
  >();
  for (const dataItem of data) {
    if (!dataItem.content) continue;
    const answer = dataItem.content;
    const answerFormatted = options.includes(answer) ? answer : 'Others';
    if (answersMap.has(answerFormatted)) {
      const answerData = answersMap.get(answerFormatted);
      if (answerData) {
        answerData.total += 1;
        answerData.details.push({
          author: dataItem.author,
          createAt: dataItem.createAt,
          answer,
        });
      }
    } else {
      answersMap.set(answerFormatted, {
        total: 1,
        details: [
          {
            author: dataItem.author,
            createAt: dataItem.createAt,
            answer,
          },
        ],
      });
    }
  }
  const overView = options.map((option) => ({
    option,
    total: answersMap.has(option) ? answersMap.get(option)?.total : 0,
    fill: 'var(--color-' + toSnakeCase(option) + ')',
  }));
  const chartConfig = generateChartConfig(options);
  if (!answersMap.size) return <></>;
  return (
    <div>
      <div className="text-center flex flex-col items-center justify-center pb-2">
        <div>{element.extraAttributes.label}</div>
        <div className="text-sm text-muted-foreground">
          {element.extraAttributes.helperText}
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={overView} dataKey="total" label nameKey="option" />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
