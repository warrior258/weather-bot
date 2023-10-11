import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { BotpoolService } from 'src/botpool/botpool.service';
import { PG_CONNECTION } from 'src/constants';

const TelegramBot = require('node-telegram-bot-api');
// const token = '6074416527:AAFUTaESdxFQQ-E4qXlJbbiZQr7DVQF5x4I';

@Injectable()
export class WeatherbotService {
  private bot: any;
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private BotpoolService: BotpoolService,
  ) {}

  //   async test() {
  //     this.bot = await this.BotpoolService.getPool();

  //     this.bot.on("message", (msg) => {
  //         console.log(msg)
  //     })
  //   }

  async intilizeBot() {
    this.bot = await this.BotpoolService.getPool();

    try {
      this.bot.on('message', async (msg) => {
        const { rows: blockedUsers } = await this.conn.query(
          'SELECT fromid FROM subscriptions WHERE blocked=true',
        );

        if (blockedUsers?.length > 0) {
          let isBlocked = blockedUsers.some(
            (user) => parseInt(user.fromid) === msg.from.id,
          );

          if (isBlocked) {
            return this.bot.sendMessage(
              msg.from.id,
              'You have been blocked by the admin!',
            );
          }
        }

        if (msg.text === '/start') {
          return this.bot.sendMessage(
            msg.chat.id,
            `Hi ${msg.from.first_name}\nWelcome to Weather Bot.\nHere the following options you can use\n/subscribe cityname - to get daily weather updates or if you want to update your city use this same command\n/city cityname - to get weather detail of a particular city`,
          );
        }

        if (msg.text?.startsWith('/city')) {
          let cityName = msg.text.split(' ')[1];

          if (!cityName) {
            return this.bot.sendMessage(
              msg.from.id,
              'Please provide the name of the city.',
            );
          }
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a056cb12a88849846aa17071cee9b5cc`;
          let message;

          try {
            const res = await axios.get(url);
            message = `${res.data.name} ${Math.trunc(
              res.data.main.temp - 273,
            )}\xB0C ${res.data.weather[0].description}`;

            this.bot.sendMessage(msg.from.id, message);
          } catch (error) {
            this.bot.sendMessage(msg.from.id, 'Invalid city name');
          }
        }

        if (msg.text?.startsWith('/subscribe')) {
          let cityName = msg.text.split(' ')[1];

          if (!cityName) {
            return this.bot.sendMessage(
              msg.from.id,
              'Please provide the name of the city.',
            );
          }

          const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a056cb12a88849846aa17071cee9b5cc`;

          try {
            await axios.get(url);
            const res = await this.conn.query(
              'INSERT INTO subscriptions(fromid, cityname, username) VALUES($1, $2, $3) ON CONFLICT (fromid) DO UPDATE SET cityname = $4',
              [msg.from.id, cityName, msg.from.first_name, cityName],
            );

            if (res.command === 'INSERT') {
              this.bot.sendMessage(msg.from.id, 'You are all set 🚀');
            }
          } catch (error) {
            if (error.code === '23505') {
              return this.bot.sendMessage(
                msg.from.id,
                'You are already susbcribed!',
              );
            }
            this.bot.sendMessage(msg.from.id, 'Invalid city name');
          }
        }
      });

      // Handling pooling error
      this.bot.on('polling_error', (error) => 
        console.log('Poolling Error Code: ', error.code),
      );
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }

    @Cron('0 8 * * *', {
      timeZone: 'Asia/Kolkata'
    })
  async handleCron() {
    try {
      const res = await this.conn.query(
        'SELECT fromid, cityname FROM subscriptions WHERE notify=true AND blocked=false',
      );
      if (res.rows.length > 0) {
        res.rows.forEach(async (item) => {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${item.cityname}&appid=a056cb12a88849846aa17071cee9b5cc`;
          // console.log(item)
          const res = await axios.get(url);
          let message = `${res.data.name} ${Math.trunc(
            res.data.main.temp - 273,
          )}\xB0C ${res.data.weather[0].description}`;

          await this.bot
            .sendMessage(
              item.fromid,
              `Good day, I'm pleased to provide you with today's weather report:\n\n${message}`,
            )
            .catch((error) => console.log('Error Code: ', error.code));
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
