/*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { basename, extname } from "@std/path";
import { format, parse } from "@std/datetime";
import { languageDemiliters } from "@src/delimiters.ts";
import MSGS from "@src/messages.json" with { type: "json" };
import { ftEmail, ftUser } from "@src/env.ts";

export type HeaderInfo = {
  filename: string;
  author: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
};

/**
 * Template where each field name is prefixed by $ and is padded with _
 */
const genericTemplate = `
********************************************************************************
*                                                                              *
*                                                         :::      ::::::::    *
*    $FILENAME__________________________________        :+:      :+:    :+:    *
*                                                     +:+ +:+         +:+      *
*    By: $AUTHOR________________________________    +#+  +:+       +#+         *
*                                                 +#+#+#+#+#+   +#+            *
*    Created: $CREATEDAT_________ by $CREATEDBY_       #+#    #+#              *
*    Updated: $UPDATEDAT_________ by $UPDATEDBY_      ###   ########.fr        *
*                                                                              *
********************************************************************************

`.substring(1);

/**
 * Get specific header template for languageId
 */
const getTemplate = (languageId: string) => {
  const demiliter = languageDemiliters[languageId];
  if (!demiliter) {
    throw new Error(MSGS.INTERNAL_ERROR.DEMILITER_NOT_FOUND);
  }
  const [left, right] = demiliter;
  const width = left.length;

  // Replace all delimiters with ones for current language
  return genericTemplate
    .replace(
      new RegExp(`^(.{${width}})(.*)(.{${width}})$`, "gm"),
      left + "$2" + right,
    );
};

/**
 * Fit value to correct field width, padded with spaces
 */
const pad = (value: string, width: number) =>
  value.concat(" ".repeat(width)).substr(0, width);

const dateFormat = "YYYY/MM/DD HH:mm:ss";
/**
 * Stringify Date to correct format for header
 */
const formatDate = (date: Date) => format(date, dateFormat);

/**
 * Get Date object from date string formatted for header
 */
const parseDate = (dateStr: string) => parse(dateStr, dateFormat);

/**
 * Check if language is supported
 */
export const supportsLanguage = (languageId: string) =>
  languageId in languageDemiliters;

/**
 * Returns current header text if present at top of document
 */
export const extractHeader = (text: string): string | null => {
  const headerRegex = `^(.{80}(\r\n|\n)){10}`;
  const match = text.match(headerRegex);

  return match ? match[0].split("\r\n").join("\n") : null;
};

/**
 * Regex to match field in template
 * Returns [ global match, offset, field ]
 */
const fieldRegex = (name: string) =>
  new RegExp(`^((?:.*\\\n)*.*)(\\\$${name}_*)`, "");

/**
 * Get value for given field name from header string
 */
const getFieldValue = (header: string, name: string) => {
  const matched = genericTemplate.match(fieldRegex(name));
  if (!matched) {
    throw new Error(MSGS.INTERNAL_ERROR.REGEX_NOT_FOUND);
  }

  const [_, offset, field] = matched;

  return header.substr(offset.length, field.length);
};

/**
 * Set field value in header string
 */
const setFieldValue = (header: string, name: string, value: string) => {
  const matched = genericTemplate.match(fieldRegex(name));
  if (!matched) {
    throw new Error(MSGS.INTERNAL_ERROR.REGEX_NOT_FOUND);
  }
  const [_, offset, field] = matched;
  //TODO
  // return header.slice(0, offset.length)
  //   + pad(value, field.length)
  //   + header.slice(offset.length + field.length);
  return header.substr(0, offset.length)
    .concat(pad(value, field.length))
    .concat(header.substr(offset.length + field.length));
};

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

interface FileInfo {
  path: string;
  name: string;
  ext: string;
}

export class Header {
  private fileInfo: FileInfo;
  private info: HeaderInfo;

  constructor(filePath: string) {
    this.fileInfo = {
      path: filePath,
      name: basename(filePath),
      ext: extname(filePath).slice(1),
    };
    this.info = Object.assign(
      {},
      // This will be overwritten if headerInfo is not null
      {
        createdAt: new Date(),
        createdBy: ftUser,
      },
      {
        filename: this.fileInfo.name,
        author: `${ftUser} <${ftEmail}>`,
        updatedBy: ftUser,
        updatedAt: new Date(),
      },
    );
  }

  /**
   * Renders a language template with header info
   */
  public render() {
    return [
      { name: "FILENAME", value: this.info.filename },
      { name: "AUTHOR", value: this.info.author },
      { name: "CREATEDAT", value: formatDate(this.info.createdAt) },
      { name: "CREATEDBY", value: this.info.createdBy },
      { name: "UPDATEDAT", value: formatDate(this.info.updatedAt) },
      { name: "UPDATEDBY", value: this.info.updatedBy },
    ].reduce(
      (header, field) => setFieldValue(header, field.name, field.value),
      getTemplate(this.fileInfo.ext),
    );
  }
}
