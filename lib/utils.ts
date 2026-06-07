import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
export * from "@/lib/utils.currency"
export * from "@/lib/utils.client"
export * from "@/lib/utils.date"
export * from "@/lib/utils.style"
export * from "@/lib/utils.username"
export * from "@/lib/utils.localStorage"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Remove properties with null, undefined, empty string, or whitespace-only string values from an object.
 * @param obj 
 * @returns cleaned object with empty properties removed
 */
export function removeEmptyProperties<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return omitBy(
    obj,
    (value) => isNil(value) || (typeof value === "string" && value.trim() === "")
  ) as Partial<T>;
}