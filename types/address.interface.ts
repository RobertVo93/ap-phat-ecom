import { IBase } from "@/types";

export interface IAddress extends IBase {
  name?: string;
  phone?: string;
  street?: string;
  ward?: string;
  city?: string;
  isDefault?: boolean;
}