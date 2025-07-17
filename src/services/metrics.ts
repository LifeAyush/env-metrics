import { api } from './api';
import type { PaginatedResponse } from './api';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { PAGINATION_CONFIG } from '../constants/config';

// Metric Types
export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMetricRequest {
  name: string;
  value: number;
  unit: string;
  category: string;
  date: string;
}

export interface UpdateMetricRequest extends Partial<CreateMetricRequest> {
  id: string;
}

export interface MetricsFilters {
  page?: number;
  limit?: number; // Changed from page_size to match backend
  sort_by?: string;
  order?: 'asc' | 'desc'; // Changed from sort_order to match backend
  category?: string; // Changed from string[] to string to match backend
  search?: string;
  date_from?: string;
  date_to?: string;
}

export type MetricsResponse = PaginatedResponse<Metric>;

// Metrics API Service
export const metricsService = {
  // Get all metrics with filters
  getMetrics: async (filters: MetricsFilters = {}): Promise<MetricsResponse> => {
    // Always fetch all results from API (ignore page parameter for now)
    const apiFilters = { ...filters };
    delete apiFilters.page; // Remove page parameter to get all results
    
    const response = await api.get<Metric[], MetricsFilters>('/metrics', apiFilters);
    
    // The API returns an array directly, so we need to wrap it in the expected structure
    const metricsArray = response.data;
    
    // Client-side pagination
    const total = metricsArray.length;
    const page = filters.page || 1;
    const startIndex = (page - 1) * PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
    const endIndex = startIndex + PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
    const paginatedData = metricsArray.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: total,
      page: page,
      page_size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
      total_pages: Math.ceil(total / PAGINATION_CONFIG.DEFAULT_PAGE_SIZE)
    };
  },

  // Get single metric by ID
  getMetric: async (id: string): Promise<Metric> => {
    const response = await api.get<Metric>(`/metrics/${id}`);
    return response.data;
  },

  // Create new metric
  createMetric: async (metric: CreateMetricRequest): Promise<Metric> => {
    const response = await api.post<Metric, CreateMetricRequest>('/metrics', metric);
    return response.data;
  },

  // Update existing metric
  updateMetric: async (metric: UpdateMetricRequest): Promise<Metric> => {
    const response = await api.put<Metric, UpdateMetricRequest>(`/metrics/${metric.id}`, metric);
    return response.data;
  },

  // Delete metric
  deleteMetric: async (id: string): Promise<void> => {
    await api.delete(`/metrics/${id}`);
  },

  // Get metric categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/metrics/categories');
      return response.data;
    } catch {
      // Return default categories if API fails
      return ['Energy', 'Water', 'Waste'];
    }
  },
};

// Utility functions for metrics
export const metricUtils = {
  // Format metric value with unit
  formatValue: (value: number, unit: string): string => {
    return `${value} ${unit}`;
  },

  // Validate metric data
  validateMetric: (metric: Partial<CreateMetricRequest>): boolean => {
    return !!(
      metric.name?.trim() &&
      typeof metric.value === 'number' &&
      metric.unit?.trim() &&
      metric.category?.trim() &&
      metric.date
    );
  },

  // Convert dayjs to ISO string
  formatDate: (date: Dayjs): string => {
    return date.toISOString();
  },

  // Parse date string to dayjs
  parseDate: (dateString: string): Dayjs => {
    return dayjs(dateString);
  },
};

export default metricsService;
