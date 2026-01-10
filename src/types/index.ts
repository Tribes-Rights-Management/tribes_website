/**
 * Common types used across the application
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// Form types
export interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

// Contact form types
export interface ContactFormData {
  full_name: string;
  email: string;
  location: string;
  message: string;
}

// License types
export interface LicenseType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}
