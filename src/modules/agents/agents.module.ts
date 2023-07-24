import { Module } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { AgentsResolver } from "./agents.resolver";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Agent, AgentSchema } from "./models/agent.model";

@Module({
  providers: [AgentsResolver, AgentsService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Agent.name,
        schema: AgentSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class AgentsModule {}
