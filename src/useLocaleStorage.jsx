import { useState } from "react";

export function useLocaleStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const AcceptableKey = localStorage.getItem(key);

    if (AcceptableKey) {
      return JSON.parse(AcceptableKey);
    }

    return initialValue;
  });

  const save = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, save];
}
