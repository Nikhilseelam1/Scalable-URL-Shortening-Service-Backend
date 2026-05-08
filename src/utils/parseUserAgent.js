import { UAParser } from "ua-parser-js";

const parseUserAgent = (uaString) => {
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  return {
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    device: result.device.type || "desktop",
  };
};

export default parseUserAgent;