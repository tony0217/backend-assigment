import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { ProblemsService } from './problems.service';
import { Problem } from './models/problem.model';
import { ProblemDTO } from './dto/problem.dto';
import { CreateProblemInput } from './dto/inputs/create-problem.input';
import { UpdateProblemInput } from './dto/inputs/update-problem.input';
import { Types } from 'mongoose';
import { StatusDTO } from '@/core/dto/status.dto';

@Resolver(() => ProblemDTO)
export class ProblemsResolver {
  constructor(private readonly problemsService: ProblemsService) {}

  @Mutation(() => ProblemDTO, { name: 'createProblem' })
  createProblem(
    @Args('createProblemInput') createProblemInput: CreateProblemInput,
  ) {
    return this.problemsService.create(createProblemInput);
  }

  @Query(() => [ProblemDTO], { name: 'problems' })
  findAll() {
    return this.problemsService.findAll();
  }

  @Query(() => ProblemDTO, { name: 'problem' })
  async findById(@Args('id', { type: () => String }) id: string) {
    const mongooseId = new Types.ObjectId(id);

    const problem = await this.problemsService.findById(mongooseId);

    if (!problem) {
      return null;
    }

    return this.transformToDTO(problem);
  }

  @Mutation(() => ProblemDTO)
  async updateProblem(
    @Args('updateProblemInput') updateProblemInput: UpdateProblemInput,
  ) {
    const updatedProblem = await this.problemsService.update(
      updateProblemInput,
    );
    return this.transformToDTO(updatedProblem);
  }

  @Mutation(() => StatusDTO)
  async removeProblem(@Args('id', { type: () => String }) id: string) {
    const removedProblem = await this.problemsService.remove(id);
    return plainToClass(StatusDTO, { ...removedProblem });
  }

  private transformToDTO(problem: Problem): ProblemDTO {
    return plainToClass(ProblemDTO, { ...problem });
  }
}
