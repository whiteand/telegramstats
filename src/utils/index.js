import { v } from 'explained-quartet';

// eslint-disable-next-line
export const logv = (schema) => {
  const isValid = v(schema);
  return (value) => {
    v();
    const res = isValid(value);
    if (!res) {
      // eslint-disable-next-line
      console.log({
        value,
        explanation: v.explanation,
      });
    }
    return res;
  };
};

export const TEXT_MESSAGE_TYPE = 'textMessage';
