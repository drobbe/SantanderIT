import { CandidatesService } from './candidates.service';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as xlsx from 'xlsx';

jest.mock('fs');
jest.mock('xlsx');

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(() => {
    service = new CandidatesService();
  });

  describe('processExcel', () => {
    const mockFilePath = 'mock.xlsx';

    it('should throw if the Excel has more than one row', () => {
      (xlsx.readFile as jest.Mock).mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      });

      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue([
        { seniority: 'junior' },
        { seniority: 'senior' },
      ]);

      expect(() => service.processExcel(mockFilePath)).toThrow(BadRequestException);
    });

    it('should process a valid Excel and delete the file', () => {
      const mockData = [{ seniority: 'senior', years: '5', availability: 'true' }];
      (xlsx.readFile as jest.Mock).mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      });

      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);

      const result = service.processExcel(mockFilePath);

      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
      expect(result).toEqual({
        seniority: 'senior',
        years: 5,
        availability: true,
      });
    });
  });

  describe('processCandidate', () => {
    it('should combine form and row data and store the result', () => {
      const form = { name: 'Ana', surname: 'Pérez' };
      const row = { seniority: 'junior', years: 2, availability: true };

      const result = service.processCandidate(form, row);

      expect(result).toEqual({
        name: 'Ana',
        surname: 'Pérez',
        seniority: 'junior',
        years: 2,
        availability: true,
      });

      expect(service.getAllCandidates()).toContainEqual(result);
    });
  });
});
