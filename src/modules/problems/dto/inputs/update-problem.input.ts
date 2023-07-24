import { CreateProblemInput } from './create-problem.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateProblemInput extends PartialType(CreateProblemInput) {
  @Field(() => String)
  @IsMongoId()
  @IsNotEmpty()
  _id: string;
}
