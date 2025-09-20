import { languageDemiliters } from "@src/header/delimiters.ts";
import MSGS from "@src/messages.json" with { type: "json" };
/**
 * Template where each field name is prefixed by $ and is padded with _
 */
export const genericTemplate = `
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
export const getTemplate = (languageId: string) => {
  const demiliter = languageDemiliters[languageId];
  if (!demiliter) 
    throw new Error(MSGS.INTERNAL_ERROR.DEMILITER_NOT_FOUND);
  const [left, right] = demiliter;
  const width = left.length;

  // Replace all delimiters with ones for current language
  return genericTemplate
    .replace(
      new RegExp(`^(.{${width}})(.*)(.{${width}})$`, "gm"),
      left + "$2" + right,
    );
};
