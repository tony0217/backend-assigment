import { AgentDocument } from '@/modules/agents/models/agent.model';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProblemDocument = Problem & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Problem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isResolved: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Agent', default: null })
  assignedTo: AgentDocument;

  toObject(): object {
    return {
      title: this.title,
      description: this.description,
      isResolved: this.isResolved,
      assignedTo: this.assignedTo,
    };
  }
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
