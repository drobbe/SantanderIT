import { IsIn, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CandidateRowDto {
  @IsIn(['junior', 'senior'], {
    message: 'Seniority must be "junior" or "senior"',
  })
  seniority: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Years of experience should be a number' })
  years: number;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Availability should be a number (true o false)' })
  availability: boolean;
}

export class ResponseCandidateDto extends CandidateRowDto {
  @Type(() => String)
  @IsString({ message: 'Name should be a name' })
  name: boolean;

  @Type(() => String)
  @IsString({ message: 'Name should be a surname' })
  surname: boolean;
}
