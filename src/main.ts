import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { binaryName, binaryVersion } from "@src/env.ts";
import updateCmd from "@src/commands/update.ts";
import { applyHeaders } from "@src/header/index.ts";

await new Command()
  .name(binaryName)
  .version(binaryVersion)
  .arguments("<dirs-or-files...>")
  .action(async (_, ...args) => {
    await applyHeaders(args);
  })
  .command("update", updateCmd)
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);

  

