import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';

import { SubscribeDto } from './dtos';
import { SubscriptionsService } from './subscriptions.service';

@Controller('')
@ApiTags('subscription')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post('/subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Subscribe user email to the distribution.',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    type: SubscribeDto,
  })
  @ApiOkResponse({ description: 'Email was successfully added.' })
  @ApiConflictResponse({ description: 'Email already exists.' })
  @ApiBadRequestResponse({ description: 'Invalid input params.' })
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    const rateValue = await this.subscriptionsService.subscribe(subscribeDto);

    return rateValue;
  }

  @Post('/sendEmails')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Distribute current BTC rate to the all subscribers.',
  })
  @ApiOkResponse({ description: 'Email distribution is successful.' })
  async sendEmails() {
    const rateValue = await this.subscriptionsService.sendEmails();

    return rateValue;
  }
}
