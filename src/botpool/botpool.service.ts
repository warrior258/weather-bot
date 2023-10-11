import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class BotpoolService {
    private readonly bot: any
    constructor(@Inject(PG_CONNECTION) private conn: any) {}

    async getPool() {
        try {
            const res = await this.conn.query('Select key from apikey');
            const botpool = new TelegramBot(res.rows[0].key, { polling: true });
            return botpool
        } catch (error) {
            console.log(error)
        }
    }
}
