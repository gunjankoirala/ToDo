import { mysqlTableCreator, varchar as _varchar, int as _int, boolean as _boolean } from 'drizzle-orm/mysql-core';
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
