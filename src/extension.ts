/*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { basename, extname } from "@std/path";

import {
  extractHeader,
  getHeaderInfo,
  HeaderInfo,
  supportsLanguage,
} from "@src/header.ts";
import { ftEmail, ftUser } from "@src/env.ts";

/**
 * Update HeaderInfo with last update author and date, and update filename
 * Returns a fresh new HeaderInfo if none was passed
 */
const newHeaderInfo = (fileName: string, headerInfo?: HeaderInfo) => {
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

export const insertHeader = async (filePath: string) => {
  const fileExt = extname(filePath).slice(1);
  if (!supportsLanguage(extname(filePath).slice(1))) {
    //TODO
    return false;
  }
  try {
    let fileContent = await Deno.readTextFile(filePath);
    const currentHeader = extractHeader(fileContent);
    if (currentHeader){
      // renderHeader(fileExt, getHeaderInfo(currentHeader));
      //TODO: replace 12newline
      // fileContent.replace
    }
    else
      fileContent = renderHeader(fileExt, newHeaderInfo(fileExt)) + fileContent;
    await Deno.writeTextFile(filePath, fileContent);
    console.log(`${filePath} is written`);

  } catch (error) {
    //TODO
    console.error("Error reading file:", error);
  }
};

