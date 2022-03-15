import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { SurfcampsService } from './surfcamps.service';
import { CreateSurfcampDto } from './dto/create-surfcamp.dto';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';

@Controller('surfcamps')
export class SurfcampsController {
    constructor(private readonly surfcampsService: SurfcampsService) {}

    @Post()
    create(@Body() createSurfcampDto: CreateSurfcampDto) {
        return this.surfcampsService.create(createSurfcampDto);
    }

    @Get()
    findAll() {
        return this.surfcampsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.surfcampsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSurfcampDto: UpdateSurfcampDto
    ) {
        return this.surfcampsService.update(+id, updateSurfcampDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.surfcampsService.remove(+id);
    }
}