import * as fs from 'fs';
import * as xlsx from 'xlsx';
import { CandidatesService } from './candidates.service';
import { CandidateRowDto } from './dto/candidate-row.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';

describe('CandidatesService', () => {
  let service: CandidatesService;

  const mockBody: CreateCandidateDto = {
    name: 'John',
    surname: 'Doe',
  };

  beforeEach(() => {
    service = new CandidatesService();
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {}); // prevent deleting real files
  });

  it('should correctly process a valid Excel file', () => {
    jest.spyOn(xlsx, 'readFile').mockReturnValueOnce({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: xlsx.utils.json_to_sheet([
          {
            seniority: 'Senior',
            years: 5,
            availability: true,
          },
        ]),
      },
    } as any);

    const result = service.processExcel(mockBody, 'file.xlsx');
    expect(result).toBeInstanceOf(CandidateRowDto);
    expect(service.getAllCandidates().length).toBe(1);
  });

  it('should throw an error if there is more than one row', () => {
    jest.spyOn(xlsx, 'readFile').mockReturnValueOnce({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: xlsx.utils.json_to_sheet([
          { seniority: 'Mid', years: 2, availability: true },
          { seniority: 'Senior', years: 5, availability: false },
        ]),
      },
    } as any);

    expect(() => service.processExcel(mockBody, 'file.xlsx')).toThrowError(
      'The file must contain exactly one row.',
    );
  });

  it('should throw an error if the data is invalid', () => {
    jest.spyOn(xlsx, 'readFile').mockReturnValueOnce({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: xlsx.utils.json_to_sheet([{ seniority: '', years: '', availability: 'invalid' }]),
      },
    } as any);

    expect(() => service.processExcel(mockBody, 'file.xlsx')).toThrowError(/Validation error/);
  });
});
