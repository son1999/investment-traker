// Prices no longer needs a store — all server state is handled by
// TanStack Query hooks (usePrices, useCreateOrUpdatePrice, useUpdatePriceByCode).
// This file is kept as a re-export for backwards compatibility during migration.

export { usePrices, useCreateOrUpdatePrice, useUpdatePriceByCode } from '@/hooks/usePrices'
//