// Hook PostToolUse (Edit|Write): formatea con Prettier el archivo recién editado.
const { execFileSync } = require("child_process");
const path = require("path");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  try {
    const file = JSON.parse(input).tool_input?.file_path;
    if (!file || !/\.(ts|tsx|js|json)$/.test(file)) return;
    if (/node_modules|package-lock\.json/.test(file)) return;
    const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    if (path.relative(root, file).startsWith("..")) return; // fuera del proyecto
    execFileSync("npx", ["prettier", "--write", file], {
      cwd: root,
      stdio: "ignore",
      shell: true,
    });
  } catch {
    // nunca bloquear la edición por un error de formato
  }
});
