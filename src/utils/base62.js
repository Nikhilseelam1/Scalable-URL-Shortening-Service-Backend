const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = CHARSET.length;

export const encode = (num) => {
  if (num === 0) return CHARSET[0];
  let result = "";
  while (num > 0) {
    result = CHARSET[num % BASE] + result;
    num = Math.floor(num / BASE);
  }
  return result;
};

export const decode = (str) => {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result * BASE + CHARSET.indexOf(str[i]);
  }
  return result;
};

export const generateShortCode = (length = 7) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * BASE)];
  }
  return result;
};