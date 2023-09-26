import { createClient } from '@clickhouse/client'
import * as dotenv from 'dotenv'
dotenv.config()

export default createClient({
  host: process.env.CLICKHOUSE_HOST ?? 'http://192.168.190.24:8123',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'default',
  database: process.env.CLICKHOUSE_DATABASE ?? 'default',
})