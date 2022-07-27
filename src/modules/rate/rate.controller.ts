import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RateService } from './rate.service';

@Controller('rate')
@ApiTags('rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: 'number' })
  async getRate() {
    const rateValue = await this.rateService.get();

    return rateValue;
  }
}
