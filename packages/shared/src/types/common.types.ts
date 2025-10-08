// Common shared types
export interface BaseComponent {
  className?: string;
  children?: React.ReactNode;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}