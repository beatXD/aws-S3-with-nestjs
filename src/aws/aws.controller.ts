import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';

@Controller('/api/v1/aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('/listBuckets')
  async listBuckets(): Promise<any> {
    return this.awsService.listBuckets();
  }

  @Get('/getAllObject')
  async getAllObject(): Promise<any> {
    return this.awsService.getAllObject();
  }

  @Get('/getObjectByKey')
  async getObjectByKey(@Query('key') key: string): Promise<any> {
    console.log('key', key);
    return this.awsService.getObjectByKey(key);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: any): Promise<any> {
    return this.awsService.upload(file);
  }
}
