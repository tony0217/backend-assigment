import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsResolver } from './problems.resolver';
import { Problem, ProblemSchema } from './models/problem.model';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentsModule } from '../agents/agents.module';

@Module({
  providers: [ProblemsResolver, ProblemsService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Problem.name,
        schema: ProblemSchema,
      },
    ]),
    AgentsModule,
  ],
  exports: [MongooseModule],
})
export class ProblemsModule {}
