import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CandidateRowDto } from './dto/candidate-row.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { Readable } from 'stream';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  const mockCandidate: CandidateRowDto = {
    seniority: 'senior',
    years: 5,
    availability: true,
  };

  const mockCombined = {
    name: 'Jane',
    surname: 'Smith',
    seniority: 'senior',
    years: 5,
    availability: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: {
            processExcel: jest.fn().mockReturnValue(mockCandidate),
            getAllCandidates: jest.fn().mockReturnValue([mockCombined]),
          },
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all candidates', () => {
    const spy = jest.spyOn(service, 'getAllCandidates');

    const result = controller.getAllCandidates();
    expect(result).toEqual([mockCombined]);
    expect(spy).toHaveBeenCalled();
  });

  it('should process an Excel file and return the candidate', () => {
    const file: Express.Multer.File = {
      path: 'fake/path.xlsx',
      fieldname: '',
      originalname: '',
      encoding: '',
      mimetype: '',
      size: 0,
      stream: new Readable(),
      destination: '',
      filename: '',
      buffer: Buffer.from([]),
    };

    const body: CreateCandidateDto = {
      name: 'Jane',
      surname: 'Smith',
    };

    const result = controller.uploadCandidate(body, file);
    expect(result).toEqual({ ...mockCandidate, ...body });

    const spy = jest.spyOn(service, 'processExcel');
    expect(spy).toHaveBeenCalled();
  });

  it('should throw an error if the file is missing', () => {
    expect(() => controller.uploadCandidate({ name: 'X', surname: 'Y' }, null as any)).toThrowError(
      'File is missing or invalid',
    );
  });
});
