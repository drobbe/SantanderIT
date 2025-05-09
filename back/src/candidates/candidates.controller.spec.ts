import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService, CombinedCandidate } from './candidates.service';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  const mockCandidates: CombinedCandidate[] = [
    {
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      years: 5,
      availability: true,
    },
    {
      name: 'Jane',
      surname: 'Smith',
      seniority: 'junior',
      years: 2,
      availability: false,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: {
            getAllCandidates: jest.fn(() => mockCandidates),
          },
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should return all candidates', () => {
    jest.spyOn(service, 'getAllCandidates');
    const result = controller.getAllCandidates();
    expect(result).toEqual(mockCandidates);
    expect(() => service.getAllCandidates()).toHaveBeenCalled();
  });
});
