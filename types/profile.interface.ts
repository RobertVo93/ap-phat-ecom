import { Gender } from "@/types"

export interface IProfile {
  username?: string
  fullName?: string
  email?: string
  phone?: string
  avatar?: string
  gender?: Gender
}