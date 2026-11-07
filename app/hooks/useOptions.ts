import { useQuery } from "@tanstack/react-query";
import { getCategoryList } from "@/app/services/masterCategoryService";
import { getMasterDoctor } from "@/app/services/masterDoctorService";
import { getSpecialistService } from "@/app/services/specialistService";

export interface SelectOption {
  label: string;
  value: string;
}

/** Categories of one kind (e.g. "HealthArticle") as select options. */
export function useCategoryOptions(flag?: string) {
  const query = useQuery({
    queryKey: ["categories", "options", flag ?? "all"],
    queryFn: () => getCategoryList({ flag, per_page: 100 }),
    select: (response): SelectOption[] => (response.data ?? []).map((item) => ({ label: item.name, value: item.id })),
  });
  return { options: query.data ?? [], isLoading: query.isLoading };
}

export function useDoctorOptions() {
  const query = useQuery({
    queryKey: ["doctors", "options"],
    queryFn: () => getMasterDoctor({ per_page: 100 }),
    select: (response): SelectOption[] => response.data.data.map((item) => ({ label: item.name, value: item.id })),
  });
  return { options: query.data ?? [], isLoading: query.isLoading };
}

export function useSpecialistOptions() {
  const query = useQuery({
    queryKey: ["specialist-services", "options"],
    queryFn: () => getSpecialistService({ per_page: 100 }),
    select: (response): SelectOption[] => response.data.data.map((item) => ({ label: item.name, value: item.id })),
  });
  return { options: query.data ?? [], isLoading: query.isLoading };
}
