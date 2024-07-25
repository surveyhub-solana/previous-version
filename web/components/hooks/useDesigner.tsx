import { useContext } from "react";
import {
  DesignerContext,
  DesignerContextType,
} from "../context/DesignerContext";

function useDesigner(): DesignerContextType {
  const context = useContext(DesignerContext);

  if (!context) {
    throw new Error(
      "useDesigner must be used within a DesignerContextProvider"
    );
  }

  return context;
}

export default useDesigner;
