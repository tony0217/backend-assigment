import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AgentsService } from "./agents.service";
import { Agent } from "./models/agent.model";
import { CreateAgentInput } from "./dto/inputs/create-agent.input";
import { UpdateAgentInput } from "./dto/inputs/update-agent.input";
import { AgentDTO } from "./dto/agent.dto";
import { Types } from "mongoose";
import { plainToClass } from "class-transformer";
import { StatusDTO } from "@/core/dto/status.dto";

@Resolver(() => AgentDTO)
export class AgentsResolver {
  constructor(private readonly agentsService: AgentsService) {}

  @Mutation(() => AgentDTO, { name: "createAgent" })
  createAgent(@Args("createAgentInput") createAgentInput: CreateAgentInput) {
    return this.agentsService.create(createAgentInput);
  }

  @Query(() => [AgentDTO], { name: "agents" })
  findAll() {
    return this.agentsService.findAll();
  }

  @Query(() => AgentDTO, { name: "agent" })
  async findOne(@Args("id", { type: () => String }) id: string) {
    const mongooseId = new Types.ObjectId(id);

    const agent = await this.agentsService.findOne(mongooseId);

    if (!agent) {
      return null;
    }

    return this.transformToDTO(agent);
  }

  @Mutation(() => AgentDTO)
  async updateAgent(
    @Args("updateAgentInput") updateAgentInput: UpdateAgentInput
  ) {
    const updatedAgent = await this.agentsService.update(updateAgentInput);
    return this.transformToDTO(updatedAgent);
  }

  @Mutation(() => StatusDTO)
  async removeAgent(@Args("id", { type: () => String }) id: string) {
    const removeAgent = await this.agentsService.remove(id);
    return plainToClass(StatusDTO, { ...removeAgent });
  }

  private transformToDTO(agent: Agent): AgentDTO {
    return plainToClass(AgentDTO, { ...agent });
  }
}
