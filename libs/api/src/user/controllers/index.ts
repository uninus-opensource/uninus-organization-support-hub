import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services';
import { AccessGuard } from '../../common';
import {
  EPaginationOrderBy,
  THeaderRequest,
  TPaginationRequest,
  TUserRequest,
  VSCreateUser,
  VSUpdateProfile,
  VSUpdateUser,
} from '@psu/entities';
import { ZodValidationPipe } from '../../common/pipes/';

import { ApiTags, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProfileDto, UserDto, UserFindByEmailDto } from '../../common/dto';
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'orderBy', enum: EPaginationOrderBy, required: false })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  async findMany(@Query() request: TPaginationRequest) {
    return await this.userService.findMany(request);
  }

  @ApiBody({ type: UserDto })
  @Post()
  async create(@Body(new ZodValidationPipe(VSCreateUser)) data: TUserRequest) {
    return await this.userService.create(data);
  }

  @Get('/me')
  async getProfile(@Request() request: THeaderRequest) {
    const {
      user: { sub: id },
    } = request;
    return await this.userService.findOne(id);
  }
  @ApiBody({ type: ProfileDto })
  @Patch('/me')
  async updateProfile(
    @Request() request: THeaderRequest,
    @Body(new ZodValidationPipe(VSUpdateProfile)) data: TUserRequest
  ) {
    const {
      user: { sub: id },
    } = request;
    return await this.userService.update({ id, fullname: data.fullname });
  }
  @ApiBody({ type: UserFindByEmailDto })
  @Post('find')
  async findUserByEmail(@Body('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @ApiBody({ type: UserDto })
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(VSUpdateUser)) data: TUserRequest
  ) {
    return await this.userService.update({ id, ...data });
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
