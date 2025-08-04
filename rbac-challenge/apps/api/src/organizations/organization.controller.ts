import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.orgService.create(dto);
  }

  @Get()
  findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orgService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateOrganizationDto) {
    return this.orgService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orgService.remove(id);
  }
}
