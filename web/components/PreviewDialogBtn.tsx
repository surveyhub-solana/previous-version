import { MdPreview } from 'react-icons/md';
import useDesigner from './hooks/useDesigner';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import React, { useCallback, useRef, useState, useTransition } from 'react';
import {
  checkValidSection,
  FormElementInstance,
  FormElements,
} from './FormElements';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import { toast } from './ui/use-toast';
import { ImSpinner2 } from 'react-icons/im';

function PreviewDialogBtn() {
  const { elements } = useDesigner();
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [commonLayout, setCommonLayout] = useState<FormElementInstance[]>(
    () => {
      const currenContent = [...elements];
      // Nếu 2 cái section trở lên mới là common còn 1 cái thì sẽ lưu toàn bộ ở section
      if (
        currenContent.filter((element) => element.type == 'SectionField')
          .length > 1
      ) {
        const firstNotLayoutElement =
          currenContent.findIndex(
            (element, index) => !checkValidSection(currenContent, index)
          ) - 1;
        console.log(currenContent);
        console.log(firstNotLayoutElement);
        console.log(currenContent.slice(0, firstNotLayoutElement));
        return currenContent.slice(0, firstNotLayoutElement);
      }
      return [];
    }
  );
  const [section, setSection] = useState<FormElementInstance[]>(() => {
    const currentContent = [...elements];
    if (elements.length < 1) return elements;
    if (
      currentContent.filter((element) => element.type == 'SectionField')
        .length < 1
    ) {
      return currentContent;
    } else if (
      currentContent.filter((element) => element.type == 'SectionField')
        .length == 1
    ) {
      const firstSectionIndex = currentContent.findIndex(
        (element) => element.type == 'SectionField'
      );
      return currentContent.splice(firstSectionIndex, 1);
    } else {
      const firstSectionIndex = currentContent.findIndex(
        (element) => element.type == 'SectionField'
      );
      const nextSectionIndex =
        currentContent
          .slice(firstSectionIndex + 1)
          .findIndex((element) => element.type == 'SectionField') +
        firstSectionIndex +
        1; // do cắt bớt firstSectionIndex + 1 phần tử nên phải + firstSectionIndex + 1 để bù lại index
      return currentContent.slice(firstSectionIndex, nextSectionIndex);
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const isFirstSection = () => {
    if (
      elements.filter((element) => element.type == 'SectionField').length <= 1
    )
      return true;
    const sections = elements.filter(
      (element) => element.type == 'SectionField'
    );
    if (section[0].id == sections[0].id) return true;
    return false;
  };
  const isLastSection = () => {
    const sections = elements.filter(
      (element) => element.type == 'SectionField'
    );
    if (!section) return true;
    if (section[0].id == sections[sections.length - 1].id) return true;
    return false;
  };
  const backSection = () => {
    const sections = elements.filter(
      (element) => element.type == 'SectionField'
    );
    const currentSectionId = section[0].id;
    const currentSectionIndex = elements.findIndex(
      (element) => element.id == currentSectionId
    );
    const prevSectionId =
      sections[
        sections.findIndex((element) => element.id == currentSectionId) - 1
      ].id;
    const prevSectionIndex = elements.findIndex(
      (element) => element.id == prevSectionId
    );
    setSection(elements.slice(prevSectionIndex, currentSectionIndex));
  };
  const nextSection = () => {
    const sections = elements.filter(
      (element) => element.type == 'SectionField'
    );
    const currentSectionId = section[0].id;
    const nextSectionId =
      sections[
        sections.findIndex((element) => element.id == currentSectionId) + 1
      ].id;
    const nextSectionIndex = elements.findIndex(
      (element) => element.id == nextSectionId
    );
    if (sections[sections.length - 1].id == nextSectionId)
      setSection(elements.slice(nextSectionIndex));
    else {
      const nextNextSectionId =
        sections[
          sections.findIndex((element) => element.id == currentSectionId) + 2
        ].id;
      const nextNextSectionIndex = elements.findIndex(
        (element) => element.id == nextNextSectionId
      );
      setSection(elements.slice(nextSectionIndex, nextNextSectionIndex));
    }
  };

  const validateForm: () => boolean = useCallback(() => {
    console.log(section);
    for (const field of section) {
      const actualValue = formValues.current[field.id] || '';
      console.log(actualValue);
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        console.log(valid);
        formErrors.current[field.id] = true;
      } else {
        if ((formErrors.current[field.id] = true))
          delete formErrors.current[field.id];
      }
    }
    console.log(formErrors.current);
    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    console.log('done');
    return true;
  }, [section]);

  const submitValue = useCallback((key: string, value: string) => {
    console.log(value);
    formValues.current[key] = value;
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="gap-2">
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            Form preview
          </p>
          <p className="text-sm text-muted-foreground">
            This is how your form will look like to your users.
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {commonLayout.map((element) => {
              const FormElement = FormElements[element.type].formComponent;
              return (
                <FormElement
                  key={element.id}
                  elementInstance={element}
                  submitValue={submitValue}
                  isInvalid={formErrors.current[element.id]}
                  defaultValue={formValues.current[element.id]}
                />
              );
            })}
            {section.map((element) => {
              if (element.type == 'SectionField') return;
              const FormElement = FormElements[element.type].formComponent;
              return (
                <FormElement
                  key={element.id}
                  elementInstance={element}
                  submitValue={submitValue}
                  isInvalid={formErrors.current[element.id]}
                  defaultValue={formValues.current[element.id]}
                />
              );
            })}
            <div className="flex pt-6 items-center">
              {elements.filter((element) => element.type == 'SectionField')
                .length <= 1 || isLastSection() ? (
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    const validForm = validateForm();
                    if (!validForm) {
                      setRenderKey(new Date().getTime());
                      toast({
                        title: 'Error',
                        description: 'please check the form for errors',
                        variant: 'destructive',
                      });
                      return;
                    } else nextSection();
                  }}
                >
                  {!pending && (
                    <>
                      <HiCursorClick className="mr-2" />
                      Submit
                    </>
                  )}
                  {pending && <ImSpinner2 className="animate-spin" />}
                </Button>
              ) : (
                <div className="gap-2 flex items-center justify-center">
                  <Button
                    onClick={() => {
                      backSection();
                    }}
                    disabled={isFirstSection()}
                    className="w-[80px] rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    className="w-[80px] rounded-xl"
                    onClick={() => {
                      const validForm = validateForm();
                      if (!validForm) {
                        setRenderKey(new Date().getTime());
                        toast({
                          title: 'Error',
                          description: 'please check the form for errors',
                          variant: 'destructive',
                        });
                        return;
                      } else nextSection();
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
              {section[0].type == 'SectionField'
                ? [section[0]].map((element) => {
                    const FormElement =
                      FormElements[element.type].formComponent;
                    return (
                      <FormElement
                        key={element.id}
                        elementInstance={element}
                        submitValue={submitValue}
                        isInvalid={formErrors.current[element.id]}
                        defaultValue={formValues.current[element.id]}
                      />
                    );
                  })
                : ''}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialogBtn;
