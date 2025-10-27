/**
 * Products Components - Centralized Exports
 * 
 * This file exports all product-related components for easy importing.
 */

// Main Component
export { ProductsList } from './ProductsList'

// Sub-components
export { ProductsHeader } from './ProductsHeader'
export { ProductsSearch } from './ProductsSearch'
export { ProductsTable } from './ProductsTable'
export { ProductsTableRow } from './ProductsTableRow'
export { ProductsPagination } from './ProductsPagination'
export { DeleteProductDialog } from './DeleteProductDialog'

// Utilities
export { getStatusBadge, getProductName, getCategoryName } from './utils'
