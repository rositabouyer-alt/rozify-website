import { APP_CONFIG } from "@/config/business";
import { SERVICES, SERVICE_CATEGORIES, getServiceById } from "@/data/services";
import type { Service, ServiceCategory } from "@/types";
import { apiRequest } from "./http";

/**
 * Service catalogue access. In demo mode the local catalogue is the source of
 * truth; with a backend configured the same shapes come from the API.
 */
export const serviceApi = {
  async listServices(): Promise<Service[]> {
    if (APP_CONFIG.demoMode || !APP_CONFIG.apiBaseUrl) return SERVICES;
    return apiRequest<Service[]>("/api/services");
  },

  async listCategories(): Promise<ServiceCategory[]> {
    if (APP_CONFIG.demoMode || !APP_CONFIG.apiBaseUrl) return SERVICE_CATEGORIES;
    return apiRequest<ServiceCategory[]>("/api/service-categories");
  },

  async getService(serviceId: string): Promise<Service | undefined> {
    if (APP_CONFIG.demoMode || !APP_CONFIG.apiBaseUrl) return getServiceById(serviceId);
    return apiRequest<Service>(`/api/services/${serviceId}`);
  },
};
