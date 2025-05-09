import { Injectable, BadRequestException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CandidateRowDto } from './dto/candidate-row.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';

type RawRow = {
  seniority: string;
  years: string | number;
  availability: boolean | string;
};

export interface CombinedCandidate {
  name: string;
  surname: string;
  seniority: string;
  years: number;
  availability: boolean;
}

@Injectable()
export class CandidatesService {
  private candidates: CombinedCandidate[] = [];
  processExcel(body: CreateCandidateDto, filePath: string): CandidateRowDto {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<RawRow>(sheet);

    fs.unlinkSync(filePath);

    if (data.length !== 1) {
      throw new BadRequestException('The file must contain exactly one row.');
    }

    const row = data[0];

    const plainRow = {
      seniority: String(row.seniority).toLowerCase(),
      years: Number(row.years),
      availability:
        row.availability === true || row.availability === 'true' || row.availability === 'TRUE'
          ? true
          : false,
    };

    const [candidateDto] = plainToInstance(CandidateRowDto, [plainRow]);
    const errors = validateSync(candidateDto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; ');
      throw new BadRequestException(`Validation error: ${messages}`);
    }
    this.processCandidate(body, candidateDto);
    return candidateDto;
  }

  processCandidate(body: CreateCandidateDto, row: CandidateRowDto): CombinedCandidate {
    const candidate: CombinedCandidate = {
      name: body.name,
      surname: body.surname,
      seniority: row.seniority,
      years: row.years,
      availability: row.availability,
    };

    this.candidates.push(candidate);
    return candidate;
  }

  getAllCandidates(): CombinedCandidate[] {
    return this.candidates;
  }
}
