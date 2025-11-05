export enum CollectionStatus {
  active = "active",
  draft = "draft",
  archived = "archived"
}

export enum ProductStatus {
  active = "active",
  inactive = "inactive",
  lowStock = "lowStock",
  outOfStock = "outOfStock"
}

export enum ProductUnit {
  kg = "kg",
  piece = "piece",
  other = "other"
}

export enum OrderStatus {
  pending = "pending",
  processing = "processing",
  shipped = "shipped",
  delivered = "delivered",
  completed = "completed",
  cancelled = "cancelled",
  lackProduct = "lackProduct"
}

export enum PaymentStatus {
  pending = "pending",
  paid = "paid",
  partial = "partial",
  failed = "failed",
  refunded = "refunded"
}

export enum PaymentMethod {
  creditCard = "creditCard",
  debitCard = "debitCard",
  bankTransfer = "bankTransfer",
  cash = "cash",
  paypal = "paypal",
  momo = "momo"
}

export enum CustomerStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending"
}

export enum CustomerType {
  vip = "vip",
  premium = "premium",
  regular = "regular"
}

export enum ViewMode {
  grid = "grid",
  list = "list"
}

export enum ProductSortBy {
  nameHigh = "nameHigh",
  nameLow = "nameLow",
  priceHigh = "priceHigh",
  priceLow = "priceLow",
}

export enum UserRole {
  super_admin = "super_admin",
  admin = "admin",
  manager = "manager",
  staff = "staff",
  customer = "customer",
}