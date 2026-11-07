import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PaginatedResponse<T> {
  success: boolean;
  data: { data: T[]; total: number; per_page: number; current_page: number; last_page: number };
}

interface ListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

interface Options<T> {
  /** Unique cache key of the resource, e.g. "doctors". */
  key: string;
  fetchList: (params: ListParams & Record<string, any>) => Promise<PaginatedResponse<T>>;
  remove: (id: string) => Promise<{ success: boolean }>;
  /** Extra filters sent to the API (e.g. a category filter). Changing them reloads the list. */
  filters?: Record<string, unknown>;
  initialPerPage?: number;
}

/**
 * Search + pagination + delete for a list page.
 * The query re-runs whenever the search text, page, page size or filters change.
 */
export function usePaginatedList<T>({ key, fetchList, remove, filters, initialPerPage = 10 }: Options<T>) {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const params = { ...(filters ?? {}), search, page, per_page: perPage };

  const query = useQuery({
    queryKey: [key, "list", params],
    queryFn: () => fetchList(params),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    onError: () => alert("Gagal menghapus data"),
  });

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const resetSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return {
    items: query.data?.data.data ?? [],
    totalItems: query.data?.data.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    searchInput,
    setSearchInput,
    submitSearch,
    resetSearch,
    page,
    setPage,
    perPage,
    setPerPage: (value: number) => {
      setPage(1);
      setPerPage(value);
    },
    deleteItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
