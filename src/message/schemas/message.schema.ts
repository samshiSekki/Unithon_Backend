import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import internal from 'stream';

export type MessageDocument = Message & Document;

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Message {
  @ApiProperty({
    description: 'Message의 objectId',
  })
  _id;

  @ApiProperty({
    type: [Users],
    description: '보내는 사람(글쓴이)',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    description: '보내는 사람(글쓴이)',
    ref: 'Users',
  })
  fromUser: Users;

  @ApiProperty({
    type: [Users],
    description: '받는 사람',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    description: '받는 사람',
    ref: 'Users',
    default: null,
  })
  toUser: Users;

  @ApiProperty({
    type: String,
    description: '쪽지 내용',
  })
  @Prop()
  content: string;

  @ApiProperty({
    type: String,
    description: '쪽지의 주제',
  })
  @Prop({
    default: null,
  })
  keyword: string;

  @ApiProperty({
    type: Boolean,
    description: '전송 여부 / true: 전송완료, false: 임시저장',
  })
  @Prop({
    default: false
  })
  state: number;

  @ApiProperty({
    type: Boolean,
    description: '받은 사람이 읽은지 여부',
  })
  @Prop({
    default: false,
  })
  readState: boolean;

  /* timestamps */
  @ApiProperty({
    type: Date,
    description: '작성 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '수정 날짜',
  })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
