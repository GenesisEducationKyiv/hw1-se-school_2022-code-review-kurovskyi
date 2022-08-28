import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

import { Email } from '../../../common/types';
import { Trim, ToLowerCase } from '../../../common/decorators';

export class SubscribeDto {
  @IsString({ message: 'Email must be a string.' })
  @Trim()
  @ToLowerCase()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  @ApiProperty({
    description: 'Email of the user that have to be subscribed.',
  })
  email: Email;
}
