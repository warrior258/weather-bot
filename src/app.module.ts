import { Module, OnModuleInit } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { WeatherbotService } from './weatherbot/weatherbot.service';
import { WeatherbotModule } from './weatherbot/weatherbot.module';

@Module({
  imports: [AdminModule, WeatherbotModule],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly WeatherbotService: WeatherbotService) {}
  onModuleInit() {
    this.WeatherbotService.intilizeBot();
  }
}
