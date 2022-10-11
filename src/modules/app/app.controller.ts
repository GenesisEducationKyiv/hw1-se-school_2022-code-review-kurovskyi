import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('health')
@ApiTags('common')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API heartbeat.',
  })
  @ApiOkResponse({ description: 'Server is alive.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
