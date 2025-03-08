import { RoleDTO } from "../entities/types";

export type TokenPayload = {
  id: string;
  infos: {
    lastName: string;
    firstname: string;
    email: string;
    roles: RoleDTO[]
  };
};

export type EMAIL_SETTING = {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  },
}

export type EMAIL_CONFIG = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export type TEMPLATE = {
  title: string;
  text: string;
  explanation?: string;
}