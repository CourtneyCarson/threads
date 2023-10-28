import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schemas/comment.schema';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    const createdComment = this.commentModel.create({
      text: createCommentDto.text,
      parent: createCommentDto.parentId || null,
      user: createCommentDto.userId,
    });
    return createdComment.then((doc) => {
      // returns back the comment with the user and parent entire object, not just id
      return doc.populate(['user', 'parent']);
    });
  }

  findAll() {
    return this.commentModel.find().populate(['user', 'parent']).exec(); // return an array
  }

  // get all comments route /comments
  getTopLevelComments() {
    return this.commentModel
      .find({
        parent: null,
      })
      .populate(['user', 'parent'])
      .sort({ createdAt: -1 })
      .exec(); // returns an array
  }

  // get all nested comments by parent id route /comments/:parentId
  getCommentsByParentId(parentId: string) {
    return this.commentModel
      .find({
        parent: parentId,
      })
      .populate(['user', 'parent'])
      .sort({ createdAt: -1 })
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
