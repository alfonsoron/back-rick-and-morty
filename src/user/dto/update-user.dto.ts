import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  mail?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
