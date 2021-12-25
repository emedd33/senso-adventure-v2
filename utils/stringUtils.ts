export const createSessionSnippet = (htmlString: string) => {
  const cleanString = htmlString.replace(/<[^>]*>?/gm, "");
  if (cleanString.length < 415) {
    return cleanString;
  }
  return cleanString.substring(0, 415);
};
