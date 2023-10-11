import { Module } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { Pool } from 'pg'

const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new Pool({
        user: 'postgres',
        host: 'db.ztqthcfoofjvspvbewvk.supabase.co',
        database: 'weatherbot',
        password: 'Weatherbot123#',
        port: 5432
    })
}

@Module({
    providers: [dbProvider],
    exports: [dbProvider],
})
export class DbModule {}
