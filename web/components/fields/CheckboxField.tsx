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
import { IoMdCheckbox } from 'react-icons/io';
import { Button } from '../ui/button';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
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
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { toast } from '../ui/use-toast';
import { Separator } from '../ui/separator';
import { el } from 'date-fns/locale';

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
  answerComponent: AnswerComponent,
  dataComponent: DataComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
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
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAttributes;

  // State for stringValues
  const [stringValues, setStringValues] = useState<string[]>(() => {
    const optionValues = [...options];
    if (options[options.length - 1] === 'input-other')
      optionValues[optionValues.length - 1] = '';
    return optionValues;
  });

  // State for boolean values
  const [values, setValues] = useState<boolean[]>(() => {
    if (defaultValue == null) {
      return Array(options.length).fill(false);
    } else {
      const defaultValues = JSON.parse(defaultValue);
      const newArray = Array(options.length).fill(false);
      options.forEach((option, index) => {
        if (defaultValues.includes(option) && index !== options.length - 1)
          newArray[index] = true;
      });
      return newArray;
    }
  });

  // Handle setting string values for 'input-other' if necessary
  useEffect(() => {
    let defaultValues = [];
    // Safely parse defaultValue if it's valid
    if (defaultValue) {
      try {
        defaultValues = JSON.parse(defaultValue);
      } catch (error) {
        console.error('Invalid JSON format in defaultValue: ', error);
      }
    }

    // Handle the 'input-other' option
    if (
      options[options.length - 1] === 'input-other' &&
      !options.includes(defaultValues[defaultValues.length - 1]) &&
      defaultValues.length > 0 &&
      defaultValues[defaultValues.length - 1].length > 0
    ) {
      setValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[newValues.length - 1] = true;
        return newValues;
      });

      setStringValues((prevStringValues) => {
        const newStringValue = [...prevStringValues];
        newStringValue[newStringValue.length - 1] =
          defaultValues[defaultValues.length - 1];
        return newStringValue;
      });
    }
  }, [defaultValue, options]);

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
              <>
                <Label key={`${element.id}-${index}-label`}>Other</Label>
                <Input
                  key={`${element.id}-${index}-input`}
                  value={stringValues[stringValues.length - 1] || ''}
                  type="text"
                  placeholder="Value..."
                  className={`${cn(
                    error && 'text-red-500 border-b-red-500'
                  )} border-b-2 border-t-0 border-r-0 border-l-0 focus-visible:ring-0`}
                  onChange={(e) => {
                    // Tạo ra bản sao của cả hai mảng values và stringValues
                    const newValues = [...values];
                    const newStringValue = [...stringValues];

                    // Cập nhật giá trị tại vị trí tương ứng
                    newValues[index] = true;
                    newStringValue[newStringValue.length - 1] = e.target.value;

                    // Cập nhật trạng thái một lần sau khi các thay đổi đã được thực hiện
                    setValues(newValues);
                    setStringValues(newStringValue);

                    // Nếu không có submitValue thì không làm gì tiếp theo
                    if (!submitValue) return;

                    // Lọc các giá trị hợp lệ (không rỗng và có đánh dấu true trong newValues)
                    const filteredArray = newStringValue.filter(
                      (item, index) => item !== '' && newValues[index] === true
                    );

                    // Chuyển đổi mảng thành chuỗi JSON
                    const resultString = JSON.stringify(filteredArray);

                    // Kiểm tra tính hợp lệ
                    const valid = CheckboxFieldFormElement.validate(
                      element,
                      resultString
                    );

                    // Cập nhật lỗi nếu không hợp lệ
                    setError(!valid);

                    // Gọi hàm submit
                    submitValue(element.id, resultString);
                  }}
                />
              </>
            ) : (
              <Label
                htmlFor={`${element.id}-${index}`}
                className={`${cn(error && 'text-red-500')}`}
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
function AnswerComponent({
  elementInstance,
  answers,
}: {
  elementInstance: FormElementInstance;
  answers?: string[];
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAttributes;

  const [values, setValues] = useState<boolean[]>(() => {
    const newValues = Array(options.length).fill(false);
    return [...newValues];
  });

  // Sử dụng useEffect để cập nhật values khi answers hoặc options thay đổi
  useEffect(() => {
    const newValues = Array(options.length).fill(false);

    if (answers && answers.length > 0) {
      if (
        options[options.length - 1] === 'input-other' &&
        !options.includes(answers[answers.length - 1])
      ) {
        newValues[options.length - 1] = true;
      }
      answers.forEach((answer) => {
        if (options.includes(answer)) {
          newValues[options.findIndex((option) => option === answer)] = true;
        }
      });
    }

    setValues(newValues);
  }, [answers, options]);

  return (
    <div className="flex flex-col items-top">
      <Label className={`leading-relaxed`}>
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
              aria-readonly
            />
            {option === 'input-other' && index === options.length - 1 ? (
              <>
                <Label key={`${element.id}-${index}-label`}>Other</Label>
                <Input
                  key={`${element.id}-${index}-input`}
                  type="text"
                  placeholder="Value..."
                  className={`border-b-2 border-t-0 border-r-0 border-l-0 focus-visible:ring-0`}
                  value={
                    values[index] && answers ? answers[answers.length - 1] : ''
                  }
                />
              </>
            ) : (
              <Label
                htmlFor={`${element.id}-${index}`}
                key={`${element.id}-${index}-label`}
                className={
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
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
    result[option] = {
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
    const answers = JSON.parse(dataItem.content) as string[];
    answers.forEach((answer) => {
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
    });
  }
  const overView = options.map((option) => ({
    option,
    total: answersMap.has(option) ? answersMap.get(option)?.total : 0,
    fill: 'var(--color-' + option + ')',
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
