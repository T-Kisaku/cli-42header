import { format, parse } from "@std/datetime";

const dateFormat = "yyyy/MM/dd HH:mm:ss";
export const formatDate = (date: Date) => format(date, dateFormat);
//TODO: when str is unavalilable to parse
export const parseDate = (dateStr: string) => parse(dateStr, dateFormat);
