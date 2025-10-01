import {
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  CollectionStatus,
} from "@/types/enums"

export const getProductStatusColor = (status: string) => {
  switch (status) {
    case ProductStatus.active:
      return "bg-green-100 text-green-800"
    case ProductStatus.inactive:
      return "bg-gray-100 text-gray-800"
    case ProductStatus.lowStock:
      return "bg-yellow-100 text-yellow-800"
    case ProductStatus.outOfStock:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// export const getCustomerStatusColor = (status: string) => {
//   switch (status) {
//     case CustomerStatus.active:
//       return "bg-green-100 text-green-800"
//     case CustomerStatus.inactive:
//       return "bg-red-100 text-red-800"
//     case CustomerStatus.pending:
//       return "bg-yellow-100 text-yellow-800"
//     default:
//       return "bg-gray-100 text-gray-800"
//   }
// }

// export const getCustomerTypeColor = (type: string) => {
//   switch (type) {
//     case CustomerType.vip:
//       return "bg-purple-100 text-purple-800"
//     case CustomerType.premium:
//       return "bg-blue-100 text-blue-800"
//     case CustomerType.regular:
//       return "bg-gray-100 text-gray-800"
//     default:
//       return "bg-gray-100 text-gray-800"
//   }
// }



export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.completed:
      return "bg-green-100 text-green-800"
    case OrderStatus.processing:
      return "bg-yellow-100 text-yellow-800"
    case OrderStatus.shipped:
      return "bg-blue-100 text-blue-800"
    case OrderStatus.delivered:
      return "bg-purple-100 text-purple-800"
    case OrderStatus.pending:
      return "bg-gray-100 text-gray-800"
    case OrderStatus.cancelled:
      return "bg-red-100 text-red-800"
    case OrderStatus.lackProduct:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PaymentStatus.paid:
      return "bg-green-100 text-green-800"
    case PaymentStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    case PaymentStatus.failed:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getCollectionStatusColor = (status: string) => {
  switch (status) {
    case CollectionStatus.active:
      return "bg-green-100 text-green-800"
    case CollectionStatus.draft:
      return "bg-yellow-100 text-yellow-800"
    case CollectionStatus.archived:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}