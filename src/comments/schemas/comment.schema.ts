import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: true, // each comment will have a createdAt and updatedAt field
})
export class Comment {
  @Prop()
  text: string;

  @Prop()
  likes: number;

  // connect to user bc user posts the comment
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User; // will send back user object

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parent: Comment | null; // will send back comment object
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// text, user id, parent id, id, likes
// user, parent
