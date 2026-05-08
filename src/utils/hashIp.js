import crypto from "crypto";

const hashIp = (ip) => {
  return crypto.createHash("sha256").update(ip).digest("hex");
};

export default hashIp;