import { Module } from '@nestjs/common';
import { BotpoolService } from './botpool.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [BotpoolService],
  exports: [BotpoolService]
})
export class BotpoolModule {}
