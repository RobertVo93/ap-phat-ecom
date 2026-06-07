import type { BrandSettings } from "@/types"

export function normalizeBrandSettings(values: Record<string, unknown>): Partial<BrandSettings> {
  const normalized: Partial<BrandSettings> = {}

  setStringValue(normalized, values, "name")
  setStringValue(normalized, values, "subName")
  setStringValue(normalized, values, "owner")
  setStringValue(normalized, values, "address")
  setStringValue(normalized, values, "phone")
  setStringValue(normalized, values, "email")
  setStringValue(normalized, values, "facebook")
  setStringValue(normalized, values, "youtube")
  setStringArrayValue(normalized, values, "maps")

  return normalized
}

function setStringValue<T extends keyof BrandSettings>(
  target: Partial<BrandSettings>,
  values: Record<string, unknown>,
  key: T
) {
  const value = values[key]
  if (typeof value === "string" && value.trim()) {
    target[key] = value as BrandSettings[T]
  }
}

function setStringArrayValue<T extends keyof BrandSettings>(
  target: Partial<BrandSettings>,
  values: Record<string, unknown>,
  key: T
) {
  const value = values[key]
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    target[key] = value as BrandSettings[T]
  }
}
