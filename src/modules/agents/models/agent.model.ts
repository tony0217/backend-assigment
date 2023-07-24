import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProblemDocument } from "../../problems/models/problem.model";

export type AgentDocument = Agent & Document;

@Schema({
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  versionKey: false,
})
export class Agent {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: "Problem", default: null })
  assignedProblem: ProblemDocument;

  toObject(): object {
    return {
      name: this.name,
      assignedProblem: this.assignedProblem,
    };
  }
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
