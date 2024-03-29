import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ActivityService } from '../services';
import { AccessGuard, ActivityDto } from '../../common';
import {
  EActivityStatusTranslation,
  EChartType,
  EMonthNames,
  EPaginationOrderBy,
  TActivityRequest,
  THeaderRequest,
  TPaginationRequest,
  VSCreateActivity,
  VSUpdateActivity,
} from '@psu/entities';
import { ZodValidationPipe } from '../../common/pipes/';
import { ApiTags, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('Activity')
@ApiBearerAuth()
@Controller('activity')
@UseGuards(AccessGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'orderBy', enum: EPaginationOrderBy, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    enum: [
      EActivityStatusTranslation.APPROVED,
      EActivityStatusTranslation.REJECTED,
      EActivityStatusTranslation.REVISION,
      EActivityStatusTranslation.ONGOING,
      EActivityStatusTranslation.REQUESTED,
    ],
    required: false,
  })
  @Get('submission')
  async submission(
    @Request() request: THeaderRequest,
    @Query() query: TPaginationRequest
  ) {
    return this.activityService.submission({
      organizationId: request?.user?.organizationId,
      ...query,
    });
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'orderBy', enum: EPaginationOrderBy, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    enum: [
      EActivityStatusTranslation.NOTREPORTED,
      EActivityStatusTranslation.REPORTED,
    ],
    required: false,
  })
  @Get('report')
  async report(
    @Request() request: THeaderRequest,
    @Query() query: TPaginationRequest
  ) {
    return this.activityService.report({
      organizationId: request?.user?.organizationId,
      ...query,
    });
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'orderBy', enum: EPaginationOrderBy, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    enum: [
      EActivityStatusTranslation.REJECTED,
      EActivityStatusTranslation.APPROVED,
      EActivityStatusTranslation.REVISION,
    ],
    required: false,
  })
  @Get('approval')
  async approval(
    @Request() request: THeaderRequest,
    @Query() query: TPaginationRequest
  ) {
    return this.activityService.approval({
      userId: request?.user?.sub,
      ...query,
    });
  }

  @ApiBody({ type: ActivityDto })
  @Post()
  async create(
    @Body(new ZodValidationPipe(VSCreateActivity)) data: TActivityRequest
  ) {
    return await this.activityService.create(data);
  }

  @ApiQuery({ name: 'type', enum: EChartType, required: false })
  @ApiQuery({ name: 'month', enum: EMonthNames, required: false })
  @ApiQuery({
    name: 'status',
    enum: [
      EActivityStatusTranslation.REQUESTED,
      EActivityStatusTranslation.REJECTED,
      EActivityStatusTranslation.APPROVED,
    ],
    required: false,
  })
  @Get('/chart')
  async chart(
    @Request() request: THeaderRequest,
    @Query('type') type: EChartType,
    @Query('status')
    status:
      | EActivityStatusTranslation.REQUESTED
      | EActivityStatusTranslation.REJECTED
      | EActivityStatusTranslation.APPROVED,
    @Query('month') month: EMonthNames
  ) {
    return await this.activityService.chart({
      type,
      status,
      month,
      organizationId: request.user.organizationId,
      role: request.user.role.name,
    });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.activityService.findOne(id);
  }

  @ApiBody({ type: ActivityDto })
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(VSUpdateActivity)) data: TActivityRequest
  ) {
    return await this.activityService.update({ id, ...data });
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.activityService.delete(id);
  }
}
