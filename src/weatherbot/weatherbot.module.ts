import { Module, OnModuleInit } from '@nestjs/common';
import { WeatherbotService } from './weatherbot.service';
import { WeatherbotController } from './weatherbot.controller';
import { DbModule } from 'src/db/db.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BotpoolModule } from 'src/botpool/botpool.module';

@Module({
  imports: [DbModule, BotpoolModule, ScheduleModule.forRoot()],
  providers: [WeatherbotService],
  controllers: [WeatherbotController],
  exports: [WeatherbotService]
})
export class WeatherbotModule {}
