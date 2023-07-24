import { AgentDTO } from "@/modules/agents/dto/agent.dto";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class ProblemDTO {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  isResolved: boolean;

  @Field(() => AgentDTO, { nullable: true })
  assignedTo?: AgentDTO;
}
