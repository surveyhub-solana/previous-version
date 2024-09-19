'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';
import {
  checkValidSection,
  FormElementInstance,
  LayoutElements,
} from '../FormElements';
import { idGenerator } from '@/lib/idGenerator';

export type DesignerContextType = {
  elements: FormElementInstance[];
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

  updateElement: (id: string, element: FormElementInstance) => void;

  filterElements: () => FormElementInstance[];
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

const setSectionIndex = (elements: FormElementInstance[]) => {
  const sectionField = elements.filter(
    (element) => element.type == 'SectionField'
  );
  console.log(sectionField);
  elements.forEach((element, index) => {
    if (element.type == 'SectionField' && element.extraAttributes) {
      const extraAttributes = {
        ...element.extraAttributes, // Giữ lại các thuộc tính khác trong extraAttributes nếu có
        no: sectionField.findIndex((section) => section.id === element.id) + 1, // Gán giá trị mới cho thuộc tính 'no'
        total: sectionField.length,
      };

      // Cập nhật phần tử tại vị trí index trong mảng elements
      elements[index] = {
        ...element,
        extraAttributes,
      };
    }
  });
};

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      if (element.type == 'SectionField') {
        if (!checkValidSection(elements, index)) {
          const firstNotLayoutElement =
            newElements.findIndex(
              (element, index) => !checkValidSection(elements, index)
            ) - 1; // tìm vị trí đầu tiên có phần tử ngoài layout. Ví dụ layout liên tiếp tới index là 5 thì khi truyền vào 7 vào (xem xét phần tử 6 do slice không lấy end) nó trả về false là !false = true
          newElements.splice(firstNotLayoutElement, 0, {
            id: idGenerator(),
            type: 'SectionField',
            extraAttributes: { no: 1 },
          });
        }
        setSectionIndex(newElements);
      } else if (
        index <
          newElements.findIndex((element) => element.type == 'SectionField') &&
        !LayoutElements.includes(element.type)
      ) {
        if (newElements.some((element) => element.type == 'SectionField')) {
          const firstSectionIndex = newElements.findIndex(
            (element) => element.type == 'SectionField'
          );
          const firstSection = newElements[firstSectionIndex];
          newElements.splice(firstSectionIndex, 1);
          newElements.splice(index, 0, firstSection);
        }
      }
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setElements((prev) => {
      const typeElement = prev.find((element) => element.id == id)?.type;
      const newElements = [...prev.filter((element) => element.id !== id)];
      if (typeElement == 'SectionField') {
        if (
          newElements.filter((element) => element.type == 'SectionField')
            .length >= 1 &&
          newElements.length > 0
        ) {
          const firstSectionIndex = newElements.findIndex(
            (element) => element.type == 'SectionField'
          );
          if (!checkValidSection(elements, firstSectionIndex)) {
            const firstNotCommonLayoutElement =
              newElements.findIndex(
                (element, index) => !checkValidSection(elements, index)
              ) - 1; // tìm vị trí đầu tiên có phần tử ngoài layout. Ví dụ layout liên tiếp tới index là 5 thì khi truyền vào 7 vào (xem xét phần tử 6 do slice không lấy end) nó trả về false là !false = true
            newElements.splice(firstNotCommonLayoutElement, 0, {
              id: idGenerator(),
              type: 'SectionField',
              extraAttributes: { no: 1 },
            });
          }
        }
        setSectionIndex(newElements);
      }
      return newElements;
    });
  };

  const updateElement = (id: string, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      const index = newElements.findIndex((el) => el.id === id);
      newElements[index] = element;
      return newElements;
    });
  };

  const filterElements = () => {
    const newElements = [...elements];
    newElements.forEach((element, index) => {
      if (
        element.type == 'SectionField' &&
        newElements[index + 1].type == 'SectionField'
      ) {
        newElements.splice(index + 1, 1);
      }
    });
    if (
      newElements.filter((element) => element.type == 'SectionField').length ==
      1
    ) {
      const firstSectionIndex = newElements.findIndex(
        (element) => element.type == 'SectionField'
      );
      newElements.splice(firstSectionIndex, 1);
    }
    if (
      newElements.filter((element) => element.type == 'SectionField').length >
        1 &&
      newElements[newElements.length - 1].type == 'SectionField'
    ) {
      newElements.pop();
    }
    return newElements;
  };

  return (
    <DesignerContext.Provider
      value={{
        elements,
        setElements,
        addElement,
        removeElement,

        selectedElement,
        setSelectedElement,

        updateElement,
        filterElements,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
