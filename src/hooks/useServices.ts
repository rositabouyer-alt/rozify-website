import { useQuery } from "@tanstack/react-query";
import { serviceApi } from "@/services/api/serviceApi";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/services";

export const servicesQueryOptions = {
  queryKey: ["services"] as const,
  queryFn: () => serviceApi.listServices(),
  initialData: SERVICES,
  staleTime: 5 * 60 * 1000,
};

export const categoriesQueryOptions = {
  queryKey: ["service-categories"] as const,
  queryFn: () => serviceApi.listCategories(),
  initialData: SERVICE_CATEGORIES,
  staleTime: 5 * 60 * 1000,
};

export function useServices() {
  const services = useQuery(servicesQueryOptions);
  const categories = useQuery(categoriesQueryOptions);
  return { services: services.data, categories: categories.data, isLoading: services.isLoading };
}
