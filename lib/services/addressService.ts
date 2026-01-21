import { AppDataSource } from "@/lib/database/typeorm";
import { IAddress } from "@/types";
import { AddressEntity } from "@/lib/database/entities";

export async function getUserAddresses(customerId: string) {
  const repo = AppDataSource.getRepository(AddressEntity);
  return repo.find({
    where: { customer: { id: customerId } },
  });
}

export async function createUserAddress(customerId: string, data: IAddress) {
  const repo = AppDataSource.getRepository(AddressEntity);

  if (data.isDefault) {
    await repo.update(
      {
        customer: { id: customerId },
        isDefault: true,
      },
      { isDefault: false }
    )
  }

  const address = repo.create({
    ...data,
    customer: { id: customerId },
  })

  return await repo.save(address)
}

export async function updateAddress(id: string, data: IAddress) {
  const repo = AppDataSource.getRepository(AddressEntity);

  const address = await repo.findOne({
    where: { id },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault === true) {
    await repo.update(
      { isDefault: true },
      { isDefault: false }
    );
  }

  Object.assign(address, data);

  return repo.save(address);
}


export async function deleteAddress(id: string) {
  const repo = AppDataSource.getRepository(AddressEntity);

  const address = await repo.findOne({ where: { id } });

  if (!address) {
    throw new Error("Address not found");
  }

  await repo.remove(address);

  return true
}