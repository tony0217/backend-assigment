import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateAgentInput {
  @Field(() => String, { description: 'Its name of agent' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
