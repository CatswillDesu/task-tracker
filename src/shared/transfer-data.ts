import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class BaseFilters {
  @Type(() => Number)
  @IsNumber()
  @Optional()
  page?: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Optional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  query?: string;
}

export class DataCollection<T> {
  constructor(data: T[], count?: number) {
    this.data = data;

    if (count !== undefined) {
      this.count = count;
    } else {
      this.count = data.length;
    }
  }

  data: T[];

  count: number;
}
