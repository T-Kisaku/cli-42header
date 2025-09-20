import { format, parse } from "@std/datetime";

const dateFormat = "yyyy/MM/dd HH:mm:ss";
export const formatDate = (date: Date) => format(date, dateFormat);
export const parseDate = (dateStr: string) => parse(dateStr, dateFormat);
