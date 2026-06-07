export type BrandSettings = {
  shortName: string
  name: string
  subName: string
  owner: string
  address: string
  phone: string
  email: string
  facebook: string
  youtube: string
  maps: string[]
}

export type Settings = {
  brand: BrandSettings
}

export const SettingConfig = {
  Brand: "brand",
} as const

export type SettingConfigType = (typeof SettingConfig)[keyof typeof SettingConfig]

export const settingConfigTypes = Object.values(SettingConfig)

export const settingKeysByConfigType = {
  [SettingConfig.Brand]: ["name", "subName", "owner", "address", "phone", "email", "facebook", "youtube", "maps"],
} as const satisfies {
  [Type in SettingConfigType]: readonly (keyof Settings[Type])[]
}

export type SettingKeyByConfigType<T extends SettingConfigType> = Extract<keyof Settings[T], string>

export type SettingKey = {
  [Type in SettingConfigType]: SettingKeyByConfigType<Type>
}[SettingConfigType]

export type SettingValue = {
  [Type in SettingConfigType]: Settings[Type][SettingKeyByConfigType<Type>]
}[SettingConfigType]
