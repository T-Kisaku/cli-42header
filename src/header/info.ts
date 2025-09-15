import { HeaderInfo } from "@src/header/type.d.ts";
import { basename } from "@std/path";
import { getTemplate } from "@src/header/template.ts";
import { getFieldValue, setFieldValue } from "@src/header/str.ts";
import { formatDate, parseDate } from "@src/header/date.ts";
import { ftEmail, ftUser } from "@src/env.ts";

/**
 * Extract header info from header string
 */
export const getHeaderInfo = (header: string): HeaderInfo => ({
  filename: getFieldValue(header, "FILENAME"),
  author: getFieldValue(header, "AUTHOR"),
  createdBy: getFieldValue(header, "CREATEDBY"),
  createdAt: parseDate(getFieldValue(header, "CREATEDAT")),
  updatedBy: getFieldValue(header, "UPDATEDBY"),
  updatedAt: parseDate(getFieldValue(header, "UPDATEDAT")),
});

/**
 * Update HeaderInfo with last update author and date, and update filename
 * Returns a fresh new HeaderInfo if none was passed
 */
export const newHeaderInfo = (fileName: string, headerInfo?: HeaderInfo) => {
  return Object.assign(
    {},
    // This will be overwritten if headerInfo is not null
    {
      createdAt: new Date(),
      createdBy: ftUser,
    },
    headerInfo,
    {
      filename: basename(fileName),
      author: `${ftUser} <${ftEmail}>`,
      updatedBy: ftUser,
      updatedAt: new Date(),
    },
  );
};

export const renderHeader = (info: HeaderInfo, fileExt: string) =>
  [
    { name: "FILENAME", value: info.filename },
    { name: "AUTHOR", value: info.author },
    { name: "CREATEDAT", value: formatDate(info.createdAt) },
    { name: "CREATEDBY", value: info.createdBy },
    { name: "UPDATEDAT", value: formatDate(info.updatedAt) },
    { name: "UPDATEDBY", value: info.updatedBy },
  ].reduce(
    (header, field) => setFieldValue(header, field.name, field.value),
    getTemplate(fileExt),
  );
