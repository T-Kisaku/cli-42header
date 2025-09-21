import MSGS from "@src/messages.json" with { type: "json" };
import { genericTemplate } from "@src/header/template.ts";

/**
 * Fit value to correct field width, padded with spaces
 */
const pad = (value: string, width: number) =>
  value.concat(" ".repeat(width)).substr(0, width);

export const splitHeaderAndBody = (
  text: string,
): { header: string | null; body: string | null } => {
  const headerRegex = `^(.{80}(\r\n|\n)){11}`;
  const match = text.match(headerRegex);

  if (!match) {
    return { header: null, body: text };
  }

  return {
    header: match[0].split("\r\n").join("\n"),
    body: text.slice(match[0].length),
  };
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
export const getFieldValue = (header: string, name: string) => {
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
export const setFieldValue = (header: string, name: string, value: string) => {
  const matched = genericTemplate.match(fieldRegex(name));
  if (!matched) {
    throw new Error(MSGS.INTERNAL_ERROR.REGEX_NOT_FOUND);
  }
  const [_, offset, field] = matched;
  return header.substr(0, offset.length)
    .concat(pad(value, field.length))
    .concat(header.substr(offset.length + field.length));
};
