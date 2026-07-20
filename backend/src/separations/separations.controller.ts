import {
  Body, Controller, Get, Param, Patch, Post, Req, Res,
  UploadedFiles, UseGuards, UseInterceptors, ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SeparationsService } from './separations.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Separations')
@ApiBearerAuth()
@Controller('separations')
@UseGuards(JwtAuthGuard)
export class SeparationsController {
  constructor(private separations: SeparationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get separation requests (role-filtered)' })
  findAll(@Req() req: any) {
    return this.separations.findAll(req.user);
  }

  @Get('analytics')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr_manager')
  @ApiOperation({ summary: 'Attrition and separation analytics' })
  getAnalytics() {
    return this.separations.getAnalytics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get separation request by ID' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.separations.findOne(id, req.user);
  }

  @Get(':id/documents/:index')
  @ApiOperation({ summary: 'Download separation document' })
  downloadDocument(
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
    @Res() res: Response,
  ) {
    return this.separations.downloadDocument(id, index, res);
  }

  @Get(':id/generate/:docType')
  @ApiOperation({ summary: 'Generate exit document (relieving/experience/settlement)' })
  generateDocument(
    @Param('id') id: string,
    @Param('docType') docType: string,
    @Res() res: Response,
  ) {
    return this.separations.generateDocument(id, docType, res);
  }

  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FilesInterceptor('documents', 10, {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const dir = join(process.cwd(), 'uploads', 'separation-documents');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (_req, file, cb) => cb(null, `sep-${Date.now()}${extname(file.originalname)}`),
    }),
  }))
  @ApiOperation({ summary: 'Submit resignation / separation request' })
  create(@Body() body: any, @Req() req: any, @UploadedFiles() files?: Express.Multer.File[]) {
    return this.separations.create(body, files, req.user);
  }

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents', 10, {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const dir = join(process.cwd(), 'uploads', 'separation-documents');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (_req, file, cb) => cb(null, `sep-${Date.now()}${extname(file.originalname)}`),
    }),
  }))
  @ApiOperation({ summary: 'Upload additional separation documents' })
  uploadDocuments(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.separations.uploadDocument(id, files || []);
  }

  @Patch(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw separation request' })
  withdraw(@Param('id') id: string, @Req() req: any) {
    return this.separations.withdraw(id, req.user);
  }

  @Patch(':id/manager-review')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr_manager', 'reporting_manager')
  @ApiOperation({ summary: 'Manager review with optional retention offer' })
  managerReview(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.separations.managerReview(id, body, req.user);
  }

  @Patch(':id/retention-response')
  @ApiOperation({ summary: 'Employee response to retention offer' })
  retentionResponse(@Param('id') id: string, @Body('accepted') accepted: boolean | string, @Req() req: any) {
    return this.separations.retentionResponse(id, accepted === true || accepted === 'true', req.user);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr_manager', 'reporting_manager')
  @ApiOperation({ summary: 'Role-based sequential separation approval' })
  approveStep(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) {
    return this.separations.approveStep(id, req.user?.role, body.status);
  }

  @Patch(':id/last-working-day')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr_manager')
  @ApiOperation({ summary: 'Update last working day and recalculate notice period' })
  updateLastWorkingDay(@Param('id') id: string, @Body() body: { lastWorkingDay?: string }, @Req() req: any) {
    return this.separations.updateLastWorkingDay(id, body, req.user);
  }

  @Patch(':id/exit-step/:stepKey')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr_manager', 'reporting_manager', 'ca')
  @ApiOperation({ summary: 'Update exit workflow step (clearance, KT, interview, settlement)' })
  updateExitStep(
    @Param('id') id: string,
    @Param('stepKey') stepKey: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.separations.updateExitStep(id, stepKey, body, req.user);
  }
}
