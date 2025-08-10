export interface FieldOptionDto {
  value: string;
  label: string;
}

export interface DependsOnDto {
  key: string;
  value: string;
}

export interface ClaimConfigConfigDto {
  id: string; // Unique identifier for the config
  key: string;
  label: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
  options: FieldOptionDto[];
  placeholder?: string;
  required?: boolean;
  validation?: string;
  defaultValue?: string;
  orderingNumber?: number;
  dependsOn?: DependsOnDto;
}

export interface StepsDto {
  title: string;
  description?: string;
  configs: Record<string, ClaimConfigConfigDto>;
  fixed?: boolean;
  orderingNumber?: number;
}

export interface ClaimConfigResponseDto {
  data: StepsDto[];
  message: string;
  status: number;
  success: boolean;
}

export interface ClaimConfigUpdateRequestDto {
  request: StepsDto[];
}
