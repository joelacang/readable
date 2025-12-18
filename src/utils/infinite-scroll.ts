/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";

// Types for the hook
export interface UseInfiniteScrollOptions {
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

export interface UseInfiniteScrollReturn {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
}

// Basic intersection observer hook
export function useInfiniteScroll(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {},
): UseInfiniteScrollReturn {
  const { rootMargin = "100px", threshold = 0.1, enabled = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const intersecting = entry?.isIntersecting ?? false;
      setIsIntersecting(intersecting);

      if (intersecting && enabled) {
        onLoadMore();
      }
    },
    [onLoadMore, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection, rootMargin, threshold, enabled]);

  return {
    loadMoreRef,
    isIntersecting,
  };
}

// Types for pagination response
export interface PaginatedResponse<TData> {
  items: TData[];
  nextCursor?: string | number | null;
  hasMore?: boolean;
}

// Types for the React Query infinite scroll hook
export interface UseInfiniteQueryScrollOptions<TData, TError = Error>
  extends UseInfiniteScrollOptions {
  queryKey: readonly unknown[];
  queryFn: (context: {
    pageParam: unknown;
  }) => Promise<PaginatedResponse<TData>>;
  getNextPageParam?: (
    lastPage: PaginatedResponse<TData>,
    allPages: PaginatedResponse<TData>[],
  ) => unknown;
  initialPageParam?: unknown;
  pageSize?: number;
  staleTime?: number;
  cacheTime?: number;
}

export interface UseInfiniteQueryScrollReturn<TData, TError = Error> {
  data: TData[];
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
}

// React Query infinite scroll hook (placeholder - requires @tanstack/react-query)
export function useInfiniteQueryScroll<TData, TError = Error>({
  queryKey,
  queryFn,
  getNextPageParam,
  initialPageParam = 1,
  pageSize = 10,
  staleTime = 5 * 60 * 1000,
  cacheTime = 10 * 60 * 1000,
  ...scrollOptions
}: UseInfiniteQueryScrollOptions<TData, TError>): UseInfiniteQueryScrollReturn<
  TData,
  TError
> {
  // Placeholder implementation - would use actual React Query in real app
  const data: { pages: PaginatedResponse<TData>[] } = { pages: [] };
  const fetchNextPage = async (): Promise<void> => Promise.resolve();
  const hasNextPage = false;
  const isFetchingNextPage = false;
  const isLoading = false;
  const isError = false;
  const error: TError | null = null;

  const { loadMoreRef } = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    {
      enabled: hasNextPage && !isFetchingNextPage,
      ...scrollOptions,
    },
  );

  const allItems = data.pages.flatMap((page) => page.items) ?? [];

  return {
    data: allItems,
    loadMoreRef,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
}

// Manual pagination infinite scroll hook
export interface UseManualInfiniteScrollOptions<TData>
  extends UseInfiniteScrollOptions {
  fetchPage: (page: number) => Promise<TData[]>;
  pageSize?: number;
  initialPage?: number;
}

export interface UseManualInfiniteScrollReturn<TData> {
  data: TData[];
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  error: Error | null;
  loadMore: () => void;
  reset: () => void;
}

export function useManualInfiniteScroll<TData>({
  fetchPage,
  pageSize = 10,
  initialPage = 1,
  ...scrollOptions
}: UseManualInfiniteScrollOptions<TData>): UseManualInfiniteScrollReturn<TData> {
  const [items, setItems] = useState<TData[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(
    async (page: number, isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const newItems = await fetchPage(page);

        if (isInitial) {
          setItems(newItems);
        } else {
          setItems((prev) => {
            // Remove duplicates based on stringified item (basic deduplication)
            const existing = new Set(prev.map((item) => JSON.stringify(item)));
            const filtered = newItems.filter(
              (item) => !existing.has(JSON.stringify(item)),
            );
            return [...prev, ...filtered];
          });
        }

        // Check if we've reached the end
        if (newItems.length < pageSize) {
          setHasNextPage(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchPage, pageSize],
  );

  // Load initial page
  useEffect(() => {
    void loadPage(initialPage, true);
  }, [loadPage, initialPage]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      void loadPage(nextPage);
    }
  }, [hasNextPage, isLoadingMore, isLoading, currentPage, loadPage]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, {
    enabled: hasNextPage && !isLoadingMore && !isLoading,
    ...scrollOptions,
  });

  const reset = useCallback(() => {
    setItems([]);
    setCurrentPage(initialPage);
    setHasNextPage(true);
    setError(null);
    void loadPage(initialPage, true);
  }, [initialPage, loadPage]);

  return {
    data: items,
    loadMoreRef,
    hasNextPage,
    isLoading,
    isLoadingMore,
    isError: !!error,
    error,
    loadMore,
    reset,
  };
}

// Types for tRPC query
export interface TRPCQueryOptions<TData, TInput = Record<string, unknown>> {
  input?: TInput;
  enabled?: boolean;
  staleTime?: number;
  keepPreviousData?: boolean;
}

export interface TRPCQueryResult<TData, TError = Error> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
}

export interface TRPCQuery<
  TData,
  TInput = Record<string, unknown>,
  TError = Error,
> {
  useQuery: (
    input: TInput,
    options?: TRPCQueryOptions<TData, TInput>,
  ) => TRPCQueryResult<TData, TError>;
}

// Hook specifically for tRPC infinite queries
export interface UseTRPCInfiniteScrollOptions<
  TData,
  TInput = Record<string, unknown>,
  TError = Error,
> extends UseInfiniteScrollOptions {
  trpcQuery: TRPCQuery<TData[], TInput & { page: number }, TError>;
  queryInput?: Omit<TInput, "page">;
  pageSize?: number;
}

export interface UseTRPCInfiniteScrollReturn<TData, TError = Error> {
  data: TData[];
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  error: TError | null;
  loadMore: () => void;
  reset: () => void;
}

// Helper type to extract item type from array
type ItemWithId = { id: string | number };

export function useTRPCInfiniteScroll<
  TData extends ItemWithId,
  TInput = Record<string, unknown>,
  TError = Error,
>({
  trpcQuery,
  queryInput = {} as Omit<TInput, "page">,
  pageSize = 10,
  ...scrollOptions
}: UseTRPCInfiniteScrollOptions<
  TData,
  TInput,
  TError
>): UseTRPCInfiniteScrollReturn<TData, TError> {
  const [allItems, setAllItems] = useState<TData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use tRPC query with proper typing
  const {
    data: currentPageData,
    isLoading,
    isError,
    error,
  } = trpcQuery.useQuery(
    { ...queryInput, page: currentPage } as TInput & { page: number },
    {
      enabled: hasNextPage,
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true,
    },
  );

  // Update items when new data arrives
  useEffect(() => {
    if (currentPageData && currentPageData.length > 0) {
      if (currentPage === 1) {
        setAllItems(currentPageData);
      } else {
        setAllItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = currentPageData.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...newItems];
        });
      }
      setIsLoadingMore(false);

      // Check if we've reached the end
      if (currentPageData.length < pageSize) {
        setHasNextPage(false);
      }
    } else if (
      currentPageData &&
      currentPageData.length === 0 &&
      currentPage > 1
    ) {
      setHasNextPage(false);
      setIsLoadingMore(false);
    }
  }, [currentPageData, currentPage, pageSize]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore && !isLoading) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage, isLoadingMore, isLoading]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, {
    enabled: hasNextPage && !isLoadingMore && !isLoading,
    ...scrollOptions,
  });

  const reset = useCallback(() => {
    setAllItems([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setIsLoadingMore(false);
  }, []);

  return {
    data: allItems,
    loadMoreRef,
    hasNextPage,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore: isLoadingMore || (isLoading && currentPage > 1),
    isError,
    error,
    loadMore,
    reset,
  };
}
