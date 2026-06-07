import type { ISettingByConfigTypeResponse, SettingConfigType } from "@/types"

export async function getSettingsByConfigTypeClient<T extends SettingConfigType>(
  configType: T
): Promise<ISettingByConfigTypeResponse<T>> {
  const res = await fetch(`/admin/api/settings/type/${encodeURIComponent(configType)}`)

  if (!res.ok) throw new Error("Failed to fetch settings")

  return res.json()
}
