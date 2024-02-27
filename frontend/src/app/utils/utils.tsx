export const stripInt = (str: string): number => {
  return str ? parseInt(str.replace(/\D/g, '')) : 0;
};

export const stripFloat = (str: string): string => {
  return str.replace(/[^\d.]/g, '');
};
