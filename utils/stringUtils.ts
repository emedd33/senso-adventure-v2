export const cleanHtmlString = (htmlString: string) => {
  if (htmlString.length > 415) {
    return htmlString.replace(/<[^>]*>?/gm, "");
  }
  return htmlString;
};
