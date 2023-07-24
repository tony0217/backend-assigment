import { ProblemDTO } from '@/modules/problems/dto/problem.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AgentDTO {
  @Field(() => String)
  _id: string;

  @Field()
  name: string;

  @Field(() => ProblemDTO, { nullable: true, defaultValue: null })
  assignedProblem?: ProblemDTO;
}
