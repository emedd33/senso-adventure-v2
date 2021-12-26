export const getEnvironment = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === ""
  ) {
    return "http://localhost:3000";
  }

  return window.location.host.toString();
};
