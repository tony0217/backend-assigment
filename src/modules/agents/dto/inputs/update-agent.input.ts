import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateAgentInput } from './create-agent.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAgentInput extends PartialType(CreateAgentInput) {
  @Field(() => String)
  @IsMongoId()
  @IsNotEmpty()
  _id: string;
}
