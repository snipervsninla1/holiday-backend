import { Algorithm, Secret } from "jsonwebtoken";
import { randomBytes } from "crypto";

export const TOKEN_ENCRYPT_ALGO: Algorithm = "HS512";

let tokenKey: string = "";
randomBytes(48, (err, buf) => {
  tokenKey = buf.toString("base64");
});
export const DEFAULT_TOKEN_KEY: Secret = `${tokenKey}DFl3lAbM0mk5IoSx9JFalhLt5gJXXfj1drrg6G5kP8SStuKKgAEqFJzSYSZzr06K`;