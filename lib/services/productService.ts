import { AppDataSource } from "@/lib/database/typeorm";
import { CollectionEntity } from "@/lib/database/entities/collection.entity";
import { ProductEntity } from "@/lib/database/entities";

export async function getAllProducts({
  page = 1,
  limit = 20,
  sortBy = "created_at",
  sortOrder = "desc",
  filters = {} as Record<string, any>,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    collectionId?: string;
    status?: string;
    search?: string;
    priceRange?: {
      min: number;
      max: number;
    };
    stockRange?: {
      min: number;
      max: number;
    };
  };
} = {}) {
  const repo = AppDataSource.getRepository(ProductEntity);
  const qb = repo.createQueryBuilder("product");

  // Join customer
  qb.leftJoinAndSelect("product.collections", "collection");

  // Filtering
  if (filters.collectionId) qb.andWhere("collection.id = :collectionId", { collectionId: filters.collectionId });
  if (filters.status) qb.andWhere("product.status = :status", { status: filters.status });
  if (filters.priceRange) qb.andWhere("product.price BETWEEN :min AND :max", { min: filters.priceRange.min, max: filters.priceRange.max });
  if (filters.stockRange) qb.andWhere("product.stock BETWEEN :min AND :max", { min: filters.stockRange.min, max: filters.stockRange.max });
  if (filters.search) qb.andWhere("(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)", { search: `%${filters.search}%` });

  // Sorting
  qb.orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getCollectionById(id: string) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.findOneBy({ id });
}
