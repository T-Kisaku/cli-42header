function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (value === undefined) {
    console.error(`ERROR: Missing required environment variable: ${name}`);
    Deno.exit(1);
  }
  return value;
}
export const binaryName = requireEnv("BINARY_NAME");
export const binaryVersion = requireEnv("BINARY_VERSION");
export const ftUser = requireEnv("BINARY_VERSION");
export const ftEmail = requireEnv("BINARY_VERSION");
