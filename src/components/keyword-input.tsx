import { useEffect, useState, type HTMLProps } from "react";
import { Input } from "~/components/ui/input";

interface KeywordInputProps extends HTMLProps<HTMLInputElement> {
  keywords: string[];
  onKeywordChange: (keywords: string[]) => void;
}

const KeywordInput = ({
  keywords,
  onKeywordChange,
  ...props
}: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState(keywords.join(", "));

  // Sync local input state when props change
  const saveKeywords = () => {
    const parsed = inputValue
      .split(",")
      .map((kw) => kw.trim().toLowerCase())
      .filter((kw) => kw.length > 0);

    onKeywordChange(parsed);
  };

  useEffect(() => {
    const joined = keywords.join(", ");

    if (joined !== inputValue) {
      setInputValue(joined);
    }
  }, [keywords]);

  const handleBlur = () => {
    saveKeywords();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      saveKeywords();
    }
  };

  return (
    <Input
      value={inputValue}
      placeholder="e.g. sci-fi, romance, thriller"
      onChange={(e) => setInputValue(e.currentTarget.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export default KeywordInput;
