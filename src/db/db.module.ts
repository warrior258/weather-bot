import { Module } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { Pool } from 'pg'

const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new Pool({
        user: '',
        host: '',
        database: '',
        password: '',
        port: ''
    })
}

@Module({
    providers: [dbProvider],
    exports: [dbProvider],
})
export class DbModule {}
