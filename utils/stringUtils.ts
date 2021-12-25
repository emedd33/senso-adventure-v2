export const cleanHtmlString = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>?/gm, "");
};
