import { Injectable } from "@nestjs/common";
import { CreateAgentInput } from "./dto/inputs/create-agent.input";
import { UpdateAgentInput } from "./dto/inputs/update-agent.input";
import { Model, Types } from "mongoose";
import { Agent } from "./models/agent.model";
import { InjectModel } from "@nestjs/mongoose";
import { StatusDTO } from "@/core/dto/status.dto";

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private readonly agentModel: Model<Agent>
  ) {}

  async create(createAgentInput: CreateAgentInput): Promise<Agent> {
    const createdAgent = new this.agentModel(createAgentInput);
    return createdAgent.save();
  }

  async findAll(): Promise<Agent[]> {
    return this.agentModel.find().exec();
  }

  async findOne(id: Types.ObjectId): Promise<Agent> {
    return this.agentModel.findOne({ _id: id }).lean();
  }

  async update(updateAgentInput: UpdateAgentInput): Promise<Agent> {
    const { _id, ...toUpdate } = updateAgentInput;
    const mongooseId = new Types.ObjectId(_id);

    const exist = await this.agentExist(_id);
    if (!exist) {
      return this.notFound(_id);
    }

    await this.agentModel
      .updateOne({ _id: mongooseId }, { ...toUpdate }, { new: true })
      .lean();
    const agent = await this.findOne(mongooseId);
    return agent;
  }

  async remove(_id: string): Promise<StatusDTO> {
    const exist = await this.agentExist(_id);
    if (!exist) {
      return this.notFound(_id);
    }
    this.agentModel.findByIdAndRemove(_id).exec();
    return {
      status: "success",
      message: `Agent deleted successfully`,
    };
  }

  private async notFound(_id: string | Types.ObjectId): Promise<any> {
    return {
      status: "Not Found",
      message: `Agent with id ${_id} does not exist`,
    };
  }

  private async agentExist(_id: string | Types.ObjectId): Promise<boolean> {
    const mongooseId = new Types.ObjectId(_id);
    const agent = await this.findOne(mongooseId);
    if (!agent) {
      return false;
    }
    return true;
  }
}
