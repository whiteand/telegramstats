import { v } from 'explained-quartet';

// eslint-disable-next-line
export const logv = (schema) => {
  const isValid = v(schema);
  return (value) => {
    v();
    const res = isValid(value);
    if (!res) {
      console.log({
        value,
        explanation: v.explanation,
      });
    }
    return res;
  };
};
