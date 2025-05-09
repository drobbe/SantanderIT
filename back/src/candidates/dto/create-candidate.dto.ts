import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty({ message: 'Name is requiered' })
  @IsString({ message: 'Name must be string' })
  name: string;

  @IsNotEmpty({ message: 'SurName is requiered' })
  @IsString({ message: 'SurName must be string' })
  surname: string;
}
