import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DbModule } from 'src/db/db.module';
import { WeatherbotModule } from 'src/weatherbot/weatherbot.module';

@Module({
  imports: [DbModule, WeatherbotModule],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
