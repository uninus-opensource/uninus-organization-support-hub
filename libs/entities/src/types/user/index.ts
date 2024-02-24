import { TMetaResponse } from '../common';
export type TUser = {
  id: string;
  fullname: string;
  image?: string;
  email: string;
  role: {
    id: string;
    name: string;
    permissions: Array<string>;
  };
};

export type TUserRequest = {
  id?: string;
  fullname: string | null;
  email?: string;
  roleId?: string;
  avatar?: string;
};
export type TUserResponse = TMetaResponse<TUserRequest[]>;

export type TUserSingleResponse = TMetaResponse<TUserRequest>;