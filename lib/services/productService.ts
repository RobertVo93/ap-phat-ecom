import { AppDataSource } from "@/lib/database/typeorm";
import { CollectionEntity } from "@/lib/database/entities/collection.entity";
import { ProductEntity } from "@/lib/database/entities";

export async function getFeaturedProducts() {
  const repo = AppDataSource.getRepository(ProductEntity);

  const data = await repo
    .createQueryBuilder("product")
    .orderBy("product.updatedAt", "DESC")
    .take(5)
    .getMany();
    
  return data;
}

export async function getCollectionById(id: string) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.findOneBy({ id });
}
