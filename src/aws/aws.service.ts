import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private s3: AWS.S3;
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private bucketName: string;

  constructor() {
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.region = process.env.AWS_REGION;
    this.bucketName = process.env.AWS_BUCKET_NAME;

    this.s3 = new AWS.S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
    });
  }

  async listBuckets(): Promise<any> {
    try {
      return await this.s3.listBuckets().promise();
    } catch (error) {
      console.log(error);
      throw new Error('Error listing buckets');
    }
  }

  async getAllObject(): Promise<any> {
    try {
      return await this.s3.listObjects({ Bucket: this.bucketName }).promise();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async getObjectByKey(key: string): Promise<any> {
    try {
      if (!key || key === '') {
        throw new HttpException('Key is required', 400);
      }
      return await this.s3
        .getObject({ Bucket: this.bucketName, Key: key })
        .promise();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async upload(file: any): Promise<any> {
    try {
      if (!file) {
        throw new HttpException('File is required', 400);
      }

      // map fileName to timestamp
      const fileType = file.mimetype.split('/')[1];
      const folderName = 'testing/';
      const fileName = folderName + new Date().getTime() + '.' + fileType;

      return await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
        })
        .promise();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
