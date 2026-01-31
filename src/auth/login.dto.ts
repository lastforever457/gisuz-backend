import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'Admin',
    description: 'User username',
  })
  username: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password: string;
}
