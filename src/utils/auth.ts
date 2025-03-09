import { compare, hash } from "bcrypt";
import { TokenPayload } from "./types";
import { Secret, sign } from "jsonwebtoken";
import { EmployeeDTO } from "../entities/types";
import { DEFAULT_TOKEN_KEY, TOKEN_ENCRYPT_ALGO } from "./constants";

export class Auth {
  private static SALBOUND: number = 10;
  private static TOKEN_KEY: Secret = process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY;
  static async makeHash(password: string): Promise<string> {
    return await hash(password, this.SALBOUND);
  }

  static async comparePassword(
    plainTextPassword: string,
    passwordHashed: string
  ): Promise<boolean> {
    return compare(plainTextPassword, passwordHashed);
  }

  static generateToken (employee: EmployeeDTO, time = "4h"): string {
    const {
      id,
      firstname,
      lastName,
      email,
      roles
    } = employee;
    return sign({
      id,
      infos: {
        email,
        firstname,
        lastName,
        roles: roles ? roles : []
      }
    } as TokenPayload, this.TOKEN_KEY, {
      algorithm: TOKEN_ENCRYPT_ALGO,
      expiresIn: time
    });
  }
}