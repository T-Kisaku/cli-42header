import { Command } from "@cliffy/command";
import { binaryName } from "@src/env.ts"
export default new Command()
  .description(`Update ${binaryName} cli`)
  .action(async () => {
    const url =
      "https://raw.githubusercontent.com/T-Kisaku/nikki-cli/main/install.sh";
    const cmd = new Deno.Command("sh", {
      args: ["-c", `curl -fsSL ${url} | sh`],
      stdout: "inherit",
      stderr: "inherit",
    });
    const { success, code } = await cmd.spawn().output();
    if (!success) Deno.exit(code);
  });
