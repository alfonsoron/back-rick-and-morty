import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  street?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cp?: string;
}
