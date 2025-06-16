import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewCollaboratorDto } from '../dtos/new-collaborator.dto';
import { CreateCollaboratorUseCase } from '../use-cases/create-collaborator.use-case';
import { AccessTokenGuard } from 'src/infrastructure/services/jwt/guards/access-token.guard';
import { FindAllCollaboratorsUseCase } from '../use-cases/find-all-collaborators.use-case';
import { ApiQuery } from '@nestjs/swagger';
import { FindCollaboratorByIdUseCase } from '../use-cases/find-collaborator-by-id.use-case';
import { UpdateCollaboratorDto } from '../dtos/update-collaborator.dto';
import { UpdateCollaboratorUseCase } from '../use-cases/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from '../use-cases/delete-collaborator.use-case';

@Controller('collaborators')
export class CollaboratorController {
  constructor(
    private readonly createCollaboratorUseCase: CreateCollaboratorUseCase,
    private readonly findAllCollaboratorsUseCase: FindAllCollaboratorsUseCase,
    private readonly findCollaboratorByIdUseCase: FindCollaboratorByIdUseCase,
    private readonly updateCollaboratorUseCase: UpdateCollaboratorUseCase,
    private readonly deleteCollaboratorUseCase: DeleteCollaboratorUseCase,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('/create-collaborator')
  async create(@Body() dto: NewCollaboratorDto) {
    const result = await this.createCollaboratorUseCase.execute(dto);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('/find-all-collaborators')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search?: string,
  ) {
    const result = await this.findAllCollaboratorsUseCase.execute(
      page,
      limit,
      search,
    );
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('/find-collaborator-by-id/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.findCollaboratorByIdUseCase.execute(id);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/update-collaborator')
  async update(@Body() dto: UpdateCollaboratorDto) {
    const result = await this.updateCollaboratorUseCase.execute(dto);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete-collaborator/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.deleteCollaboratorUseCase.execute(id);
    return result;
  }
}
