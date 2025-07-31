import { toSnakeCase } from './case';
import {
  varchar as _varchar,
  int as _int,
  boolean as _boolean,
} from 'drizzle-orm/mysql-core';

export function varchar(name: string, config: { length: number }) {
  return _varchar(toSnakeCase(name), config);
}

export function int(name: string) {
  return _int(toSnakeCase(name));
}

export function boolean(name: string) {
  return _boolean(toSnakeCase(name));
}
