import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import * as path from 'path';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ): void => {
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadCandidate(@Body() body: CreateCandidateDto, @UploadedFile() file: Express.Multer.File) {
    if (!file || !file?.path) {
      throw new Error('File is missing or invalid');
    }
    const excelData = this.candidatesService.processExcel(body, file.path);

    return { ...excelData, ...body };
  }

  @Get()
  getAllCandidates() {
    return this.candidatesService.getAllCandidates();
  }
}
