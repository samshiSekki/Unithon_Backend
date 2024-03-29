import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { GetUser } from 'src/users/get-user.decorator';
import { Users } from 'src/users/schemas/users.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './schemas/message.schema';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { MessageService } from './message.service';

@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('messages')
@ApiTags('메시지 API')
export class MessagesController {
  logger: any;
  constructor(private messageService: MessageService) {}

  @Get('/today')
  @ApiOperation({ summary: '받은 쪽지 조회' })
  async getTodayMessage(@Res() res, @GetUser() user: Users) {
    try {
      const message = await this.messageService.getTodayMessage(user);
      if (!message)
        return res.status(HttpStatus.OK).json({
          message: '받은 쪽지가 없어요',
        });
      return res.status(HttpStatus.OK).json(message);
    } catch (error) {
      this.logger.error('쪽지 조회 ERROR' + error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get()
  @ApiOperation({ summary: '받은 모든 쪽지 조회' })
  async getMessages(@Res() res, @GetUser() user: Users) {
    try {
      const messages = await this.messageService.getMessages(user);
      if (!messages)
        return res.status(HttpStatus.OK).json({
          message: '받은 쪽지가 없어요',
        });
      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      this.logger.error('모든 쪽지 조회 ERROR' + error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post()
  @ApiOperation({ summary: '쪽지 저장' })
  async postTodayMessage(
    @GetUser() user: Users,
    @Body() createMessageDto: CreateMessageDto,
    @Res() res
  ): Promise<Message> {
    try{
      const message = await this.messageService.saveTodayMessage(user, createMessageDto);
      return res.status(HttpStatus.OK).json(message)
    }
    catch(error){
      this.logger.error('쪽지 저장 ERROR' + error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('/my-message')
  @ApiOperation({ summary: '내가 작성한 쪽지 조회' })
  async getMyMessage(@GetUser() user:Users, @Res() res): Promise<Message>{
    try{
      const myMessage = await this.messageService.findMyMessage(user);
      return res.status(HttpStatus.OK).json(myMessage)
    }catch(error){
      this.logger.error('내가 작성한 쪽지 ERROR' + error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch()
  @ApiOperation({ summary: '쪽지 전송' })
  async sendTodayMessage(@GetUser() user: Users, @Res() res):Promise<String> {
    try{
      const notSendMessage = await this.messageService.notSendMessage(user)
      console.log(notSendMessage)
      if(notSendMessage){
        const message = await this.messageService.sendTodayMessage(user)
        return res.status(HttpStatus.OK).json(message)
      }
      else{
        return res.status(HttpStatus.OK).json('이미 쪽지를 보냈습니다.')
      }
    }
    catch(error){
      this.logger.error('쪽지 전송 ERROR' + error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
  
  @Delete('')
  @ApiOperation({ summary: '쪽지 전송 취소' })
  async cancelTodayMessage(@Res() res, @GetUser() user: Users) {
    try{
      const status = await this.messageService.cancelTodayMessage(user);
      if(!status)
        return res.status(HttpStatus.OK).json({
          message: '이미 상대가 쪽지를 읽었어요'
        })
      return res.status(HttpStatus.OK).json({
          message: '쪽지 전송 취소'
      })
    } catch (error) {
      this.logger.error('쪽지 전송 취소 ERROR' + error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
