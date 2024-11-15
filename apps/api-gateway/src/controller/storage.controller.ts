import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('storage')
export class StorageGateaway {
  private logger = new Logger(StorageGateaway.name);
  constructor(@Inject('STORAGE_SERVICE') private storageService: ClientProxy) {}

  @Post()
  async UploadFile(@Body() data: Express.Multer.File) {
    return (data = await firstValueFrom(
      this.storageService.send({ cmd: 'upload_file' }, data),
    ));
  }
}
