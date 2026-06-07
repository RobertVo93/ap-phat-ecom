import { IBase, IBaseFilters } from "./base.interface"
import type { SettingConfigType, SettingKey, SettingValue } from "./setting-definition"

export type ISetting = IBase & {
  configType?: SettingConfigType
  key?: SettingKey
  value?: SettingValue
  description?: string
}

export type ISettingByConfigTypeResponse<T extends SettingConfigType = SettingConfigType> = {
  configType: T
  records: ISetting[]
  values: Record<string, unknown>
}

export type ISettingFilters = IBaseFilters & {
  configType?: SettingConfigType
  key?: SettingKey
  searchTerm?: string
}
