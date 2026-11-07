import { useQuery } from "@tanstack/react-query";

/** Loads one record for an edit page. */
export function useRecord<T>(key: string, id: string | undefined, fetchOne: (id: string) => Promise<{ success: boolean; data: T }>) {
  return useQuery({
    queryKey: [key, "detail", id],
    queryFn: () => fetchOne(id as string),
    enabled: Boolean(id),
    select: (response) => response.data,
  });
}
