import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class StatusDTO {
  @Field(() => String)
  status: string;

  @Field(() => String)
  message: string;
}
