import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity } from "@/lib/database/entities";
import { IProduct, ProductSortBy, ProductStatus } from "@/types";

/**
 * Get featured products in homepage loading
 * @returns 
 */
export async function getFeaturedProducts(): Promise<IProduct[]> {
  const repo = AppDataSource.getRepository(ProductEntity);
  const qb = repo.createQueryBuilder("product");

  // Join collection only for filtering, without selecting collection data
  qb.leftJoin("product.collections", "collection");
  qb.andWhere("collection.saleable = :saleable", { saleable: true })
  qb.andWhere("product.status = :status", { status: ProductStatus.active });
  qb.orderBy(`product.createdAt`, "DESC");
  qb.take(5)
  const data = await qb.getMany();
  return data
}

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

  // Join collection only for filtering, without selecting collection data
  qb.leftJoin("product.collections", "collection");
  qb.andWhere("collection.saleable = :saleable", { saleable: true })

  // Filtering
  if (filters.collectionId) qb.andWhere("collection.id = :collectionId", { collectionId: filters.collectionId });
  if (filters.status) qb.andWhere("product.status = :status", { status: filters.status });
  if (filters.priceRange) qb.andWhere("product.price BETWEEN :min AND :max", { min: filters.priceRange.min, max: filters.priceRange.max });
  if (filters.stockRange) qb.andWhere("product.stock BETWEEN :min AND :max", { min: filters.stockRange.min, max: filters.stockRange.max });
  if (filters.search) qb.andWhere("(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)", { search: `%${filters.search}%` });

  // Sorting
  switch (sortBy) {
    case (ProductSortBy.nameHigh): {
      qb.orderBy(`product.name`, "ASC");
      break
    }
    case (ProductSortBy.nameLow): {
      qb.orderBy(`product.name`, "DESC");
      break
    }
    case (ProductSortBy.priceHigh): {
      qb.orderBy(`product.price`, "DESC");
      break
    }
    case (ProductSortBy.priceLow): {
      qb.orderBy(`product.price`, "ASC");
      break
    }
    default: {
      qb.orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");
      break
    }
  }

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getProductById(id: string) {
  const repo = AppDataSource.getRepository(ProductEntity);
  return repo.findOne({
    where: { id },
  });
}
