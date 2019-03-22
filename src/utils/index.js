import { v } from 'explained-quartet';
import { differenceInSeconds } from 'date-fns';
import median from 'median';

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

export const getTimeToResponse = (messages, userId) => {
  if (messages.length <= 0) return [];
  const res = [];
  for (let i = 1; i < messages.length; i += 1) {
    const currentMessage = messages[i];
    const prevMessage = messages[i - 1];
    // eslint-disable-next-line
    if (currentMessage.fromId !== userId || prevMessage.fromId === userId) continue;
    const currentMessageDate = new Date(currentMessage.date);
    const prevMessageDate = new Date(prevMessage.date);
    const secondsDist = differenceInSeconds(
      currentMessageDate,
      prevMessageDate,
    );
    res.push(secondsDist);
  }
  return res.length ? res : [0];
};

export const getMedianOfDelay = (messages, id) => (messages.length > 0
  ? median(getTimeToResponse(messages, id))
  : 0);

export const getMyIdFromChat = (chat) => {
  if (typeof chat === 'function') return chat().myId;
  if (typeof chat === 'object') return chat.myId;
  return null;
};

export const getOtherIdFromChat = (chat) => {
  if (typeof chat === 'function') return chat().otherId;
  if (typeof chat === 'object') return chat.otherId;
  return null;
};

export const TEXT_MESSAGE_TYPE = 'textMessage';
