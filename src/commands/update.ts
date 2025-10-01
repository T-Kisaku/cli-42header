import { Command } from "@cliffy/command";
import { binaryName } from "@src/env.ts";
const INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/T-Kisaku/42header-cli/main/scripts/install.sh" as const;
export default new Command()
  .description(`Update ${binaryName} cli`)
  .action(async () => {
    const cmd = new Deno.Command("sh", {
      args: ["-c", `curl -fsSL ${INSTALL_SCRIPT_URL} | sh`],
      stdout: "inherit",
      stderr: "inherit",
    });
    const { success, code } = await cmd.spawn().output();
    if (!success) Deno.exit(code);
  });
