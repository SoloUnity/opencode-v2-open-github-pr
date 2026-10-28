import { execFile } from "node:child_process";
import { promisify } from "node:util";

const id = "opencode-v2-open-github-pr";
const execFileAsync = promisify(execFile);

async function currentDirectory(context) {
  const route = context.ui.router.current();
  if (route.type === "session") {
    const session = await context.client.session.get({ sessionID: route.sessionID });
    if (session?.location?.directory) return session.location.directory;
  }
  return (context.location ?? context.data.location.default())?.directory;
}

function stateLabel(pr) {
  return pr.isDraft ? "a draft" : pr.state.toLowerCase();
}

export default {
  id,
  setup(context) {
    context.keymap.layer(() => ({
      mode: "global",
      commands: [
        {
          id: `${id}.open`,
          title: "Open GitHub PR",
          description: "Open the GitHub PR for the current branch in the browser",
          group: "Git",
          palette: true,
          slash: { name: "open-github-pr" },
          async run() {
            try {
              const directory = await currentDirectory(context);
              if (!directory) throw new Error("Cannot find the current directory.");
              const { stdout } = await execFileAsync(
                "gh",
                ["pr", "view", "--json", "number,url,state,isDraft"],
                { cwd: directory, timeout: 15_000 },
              );
              const pr = JSON.parse(stdout);
              await execFileAsync("open", [pr.url], { timeout: 10_000 });
              context.ui.toast.show({
                title: `Opened PR #${pr.number}`,
                message: `This PR is ${stateLabel(pr)}.`,
                variant: "success",
              });
            } catch (error) {
              context.ui.toast.show({
                title: "Cannot open the GitHub PR",
                message: error?.code === "ENOENT"
                  ? "Cannot find gh. Install the GitHub CLI and run gh auth login."
                  : error?.stderr?.trim() || (error instanceof Error ? error.message : String(error)),
                variant: "error",
              });
            }
          },
        },
      ],
    }));
  },
};
