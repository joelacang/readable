import { createContext, useContext, useState } from "react";

type UIError = {
  id: string;
  code: string;
  message: string;
  timestamp: Date;
  context?: string;
};

type ErrorContext = {
  errors: UIError[];
  addError: (error: UIError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
};

const ErrorContext = createContext<ErrorContext | null>(null);

export const useGlobalError = () => {
  const ctx = useContext(ErrorContext);

  if (!ctx)
    throw new Error("useGlobalError must be used within Error Provider.");

  return ctx;
};

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<UIError[]>([]);

  const addError = (error: UIError) => {
    setErrors((prev) => {
      const isDuplicate = prev.some((e) => e.id === error.id);

      if (isDuplicate) return prev;

      return [...prev, error];
    });
  };

  const removeError = (id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider
      value={{ errors, addError, removeError, clearErrors }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
