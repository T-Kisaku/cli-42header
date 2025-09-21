import { basename, extname } from "@std/path";
import { HeaderInfo } from "@src/header/type.d.ts";
import { isSupportedLang } from "@src/header/delimiters.ts";
import { splitHeaderAndBody } from "@src/header/str.ts";
import {
  getHeaderInfo,
  newHeaderInfo,
  renderHeader,
} from "@src/header/info.ts";

export const applyHeader = async (filePath: string) => {
  const fileExt = extname(filePath).slice(1);
  if (!isSupportedLang(fileExt)) {
    return null;
  }
  try {
    let fileContent = await Deno.readTextFile(filePath);
    const original = splitHeaderAndBody(fileContent);
    const fileName = basename(filePath);
    const info: HeaderInfo = original.header
      ? newHeaderInfo(fileName, getHeaderInfo(original.header))
      : newHeaderInfo(fileName);
    let generatedHeader = renderHeader(info, fileExt);
    if(!original.header)
    generatedHeader += "\n";
    fileContent = generatedHeader + original.body;
    await Deno.writeTextFile(filePath, fileContent);
    return filePath;
  } catch (error) {
    //TODO
    console.error("Error reading file:", error);
    return null;
  }
};
