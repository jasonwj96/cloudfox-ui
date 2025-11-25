
export const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};

export const sanitize = (rawString) => {
  return rawString.replace(/<[^>]+>/gi, '');
};
