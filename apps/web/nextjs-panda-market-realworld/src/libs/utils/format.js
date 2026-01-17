export const formatDate = (dataString) => {
  if (!dataString) return '';

  const date = new Date(dataString);
  return date.toLocaleDateString('Ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length > maxLength) return `${text.slice(0, maxLength)}...`;
  return text;
};

export const truncateDate = (text, maxLength) => {
  if (!text) return '';
  if (text.length > maxLength) return `${text.slice(0, maxLength)}`;
  return text;
};
