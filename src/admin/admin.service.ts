import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { WeatherbotService } from 'src/weatherbot/weatherbot.service';

@Injectable()
export class AdminService {

    constructor(@Inject(PG_CONNECTION) private conn: any, private WeatherbotService: WeatherbotService) {}

    async getUsers() {
        try {
            const res = await this.conn.query("Select * from subscriptions ORDER BY id ASC");
            return res.rows
        } catch (error) {
            console.log(error)
        }
    }

    async updateApiKey(key: string) {
        try {
            const res = await this.conn.query("UPDATE apikey SET key=$1 WHERE id=1", [key]);
            this.WeatherbotService.intilizeBot();
            return {message: "done"}
        } catch (error) {
            console.log(error)
        }
    }

    async blockUser(id) {
        try {
            const res = await this.conn.query("UPDATE subscriptions SET blocked=true WHERE id=$1", [id]);
            return {message: "done"}
        } catch (error) {
            console.log(error)
        }
    }

    async unblockUser(id) {
        try {
            const res = await this.conn.query("UPDATE subscriptions SET blocked=false WHERE id=$1", [id]);
            return {message: "done"}
        } catch (error) {
            console.log(error)
        }
    }

    async deleteUser(id) {
        try {
            const res = await this.conn.query("DELETE FROM subscriptions WHERE id=$1", [id]);
            return {message: "done"}
        } catch (error) {
            console.log(error)
        }
    }
}
