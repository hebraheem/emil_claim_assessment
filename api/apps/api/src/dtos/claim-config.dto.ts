import {
  IsBoolean,
  ValidateNested,
  IsOptional,
  IsArray,
  IsString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class FieldOptionDto {
  @IsString()
  value: string;

  @IsString()
  label: string;
}

class ClaimConfigConfigDto {
  @IsString()
  key: string;

  @IsString()
  label: string;

  @IsString()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  options: FieldOptionDto[];

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  validation?: string;

  @IsOptional()
  defaultValue?: string;

  @IsOptional()
  orderingNumber?: number;
}

class StepsDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  configs: Record<string, ClaimConfigConfigDto>;
}

export class VClaimConfigUpdateResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepsDto)
  data: StepsDto[];

  @IsString()
  message: string;

  @IsInt()
  status: number;

  @IsBoolean()
  success: boolean;
}

export class VClaimConfigUpdateRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepsDto)
  request: StepsDto[];
}
