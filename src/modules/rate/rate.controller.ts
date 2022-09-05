import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { RateService } from './rate.service';

@Controller('rate')
@ApiTags('rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current BTC rate.',
  })
  @ApiOkResponse({
    type: Number,
    description: 'Successfully got information.',
  })
  @ApiBadRequestResponse({ description: 'Invalid third-party response.' })
  async getRate() {
    const rateValue = await this.rateService.getRate();

    return rateValue;
  }
}
