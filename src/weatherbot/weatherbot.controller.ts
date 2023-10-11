import { Controller, Get } from '@nestjs/common';
import { WeatherbotService } from './weatherbot.service';

@Controller()
export class WeatherbotController {
    constructor(private readonly WeatherbotService: WeatherbotService) {}

    handleCron() {
        return this.WeatherbotService.handleCron();
    }

    intilizeBot() {
        return this.WeatherbotService.intilizeBot();
    }
}
