import { AppDataSource } from "@/lib/database/typeorm";
import { CollectionEntity } from "@/lib/database/entities/collection.entity";
import { CollectionStatus } from "@/types";

export async function getAllCollections() {
  const repo = AppDataSource.getRepository(CollectionEntity);
  const qb = repo.createQueryBuilder("collection");
  qb.leftJoinAndSelect("collection.products", "product");
  qb.andWhere("collection.status = :status", { status: CollectionStatus.active })
  qb.andWhere("collection.saleable = :saleable", { saleable: true });
  const data = await qb.getMany();
  return data;
}

export async function getSaleableCollectionsForFilter() {
  const repo = AppDataSource.getRepository(CollectionEntity);

  return repo.createQueryBuilder("collection")
    .select([
      "collection.id",
      "collection.number",
      "collection.name",
      "collection.description",
      "collection.status",
      "collection.image",
      "collection.saleable",
    ])
    .where("collection.status = :status", { status: CollectionStatus.active })
    .andWhere("collection.saleable = :saleable", { saleable: true })
    .orderBy("collection.name", "ASC")
    .getMany();
}
