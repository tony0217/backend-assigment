import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProblemInput {
  @Field(() => String, { description: 'Its a title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => String, { description: 'Its a description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Boolean, { description: 'Its status of problems' })
  @IsBoolean()
  @IsNotEmpty()
  isResolved: boolean;
}
