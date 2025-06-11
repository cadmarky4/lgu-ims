export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const parsePaginationQuery = (query: any): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT));
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  return { page, limit, sortBy, sortOrder };
};

export const createPaginationResult = <T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / options.limit);
  const hasNext = options.page < totalPages;
  const hasPrevious = options.page > 1;

  return {
    data,
    meta: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages,
      hasNext,
      hasPrevious,
    },
  };
};
