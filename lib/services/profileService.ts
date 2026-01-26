import { IProfile } from "@/types"
import { AppDataSource } from "@/lib/database/typeorm";
import { UserEntity } from "@/lib/database/entities";

export const updateProfile = async (id: string, data: IProfile) => {
  const repo = AppDataSource.getRepository(UserEntity);

  const user = await repo.findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  Object.assign(user, data);

  const updated = await repo.save(user);
  return updated;
};