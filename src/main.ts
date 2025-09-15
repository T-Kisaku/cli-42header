import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { binaryName, binaryVersion } from "@src/env.ts";
import updateCmd from "@src/commands/update.ts";

await new Command()
  .name(binaryName)
  .version(binaryVersion)
  .arguments("<dirs-or-files...>")
  .action((_, ...args) => {
    console.log(args);
  })
  .command("update", updateCmd)
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
