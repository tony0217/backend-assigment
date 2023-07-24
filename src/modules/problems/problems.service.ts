import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Problem } from './models/problem.model';
import { CreateProblemInput } from './dto/inputs/create-problem.input';
import { UpdateProblemInput } from './dto/inputs/update-problem.input';
import { StatusDTO } from '@/core/dto/status.dto';
import { Agent } from '../agents/models/agent.model';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectModel(Agent.name) private readonly agentModel: Model<Agent>,
    @InjectModel(Problem.name) private readonly problemModel: Model<Problem>,
  ) {}

  async findById(id: Types.ObjectId): Promise<Problem> {
    return this.problemModel.findOne({ _id: id }).lean();
  }

  async findAll(): Promise<Problem[]> {
    return this.problemModel.find().exec();
  }

  async create(createProblemInput: CreateProblemInput): Promise<Problem> {
    const createdProblem = new this.problemModel(createProblemInput);

    const freeAgent: any = await this.findFreeAgent();
    if (freeAgent) {
      createdProblem.assignedTo = freeAgent._id;
      await createdProblem.save();

      freeAgent.assignedProblem = createdProblem._id;
      await freeAgent.save();
    } else {
      await createdProblem.save();
    }
    return createdProblem;
  }

  async update(updateProblemInput: UpdateProblemInput): Promise<Problem> {
    const { _id, isResolved, ...toUpdate } = updateProblemInput;
    const mongooseId = new Types.ObjectId(_id);

    const exist = await this.problemExist(_id);
    if (!exist) {
      return this.notFound(_id);
    }

    await this.problemModel
      .updateOne({ _id: mongooseId }, { ...toUpdate }, { new: true })
      .lean();

    if (isResolved) {
      await this.releaseAgent(mongooseId);
      await this.assignNewProblemToAgent();
    } else {
      await this.updateAssignedAgent(mongooseId);
    }

    const problem = await this.findById(mongooseId);
    return problem;
  }

  async remove(_id: string): Promise<StatusDTO> {
    const exist = await this.problemExist(_id);
    if (!exist) {
      return this.notFound(_id);
    }
    await this.releaseAgent(_id);
    await this.assignNewProblemToAgent();

    this.problemModel.findByIdAndRemove(_id).exec();
    return {
      status: 'success',
      message: `Problem deleted successfully`,
    };
  }

  private async findFreeAgent(): Promise<Agent> {
    const freeAgent = await this.agentModel
      .findOne({ assignedProblem: null })
      .exec();
    return freeAgent;
  }

  private async updateAssignedAgent(problemId: Types.ObjectId): Promise<void> {
    const problem = await this.problemModel.findById(problemId).exec();
    if (problem && !problem.isResolved && !problem.assignedTo) {
      const freeAgent: any = await this.findFreeAgent();
      if (freeAgent) {
        problem.assignedTo = freeAgent._id;
        await problem.save();

        freeAgent.assignedProblem = problemId;
        await freeAgent.save();
      }
    }
  }

  private async releaseAgent(
    problemId: string | Types.ObjectId,
  ): Promise<void> {
    const problem = await this.problemModel.findById(problemId).exec();
    if (problem && problem.assignedTo) {
      const agent = await this.agentModel.findById(problem.assignedTo).exec();
      if (agent) {
        agent.assignedProblem = null;
        await agent.save();
      }
      problem.assignedTo = null;
      problem.isResolved = true;
      await problem.save();
    }
  }

  private async assignNewProblemToAgent(): Promise<void> {
    const problems: any = await this.problemModel
      .find({ isResolved: false, assignedTo: null })
      .exec();

    const freeAgents: any = await this.agentModel
      .find({ assignedProblem: null })
      .exec();

    if (problems.length > 0 && freeAgents.length > 0) {
      const problemsPerAgent = Math.floor(problems.length / freeAgents.length);

      for (let i = 0; i < freeAgents.length; i++) {
        const startIndex = i * problemsPerAgent;
        const endIndex =
          i === freeAgents.length - 1
            ? problems.length
            : (i + 1) * problemsPerAgent;
        const problemsToAssign = problems.slice(startIndex, endIndex);
        const agent = freeAgents[i];

        for (const problem of problemsToAssign) {
          problem.assignedTo = agent._id;
          agent.assignedProblem = problem._id;
          await Promise.all([problem.save(), agent.save()]);
        }
      }
    }
  }

  private async notFound(_id: string | Types.ObjectId): Promise<any> {
    return {
      status: 'Not Found',
      message: `Problem with id ${_id} does not exist`,
    };
  }

  private async problemExist(_id: string | Types.ObjectId): Promise<boolean> {
    const mongooseId = new Types.ObjectId(_id);
    const problem = await this.findById(mongooseId);
    if (!problem) {
      return false;
    }
    return true;
  }
}
