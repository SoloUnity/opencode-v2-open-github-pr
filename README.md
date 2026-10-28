# opencode-v2-open-github-pr

Adds `/open-github-pr` to OpenCode V2. The command opens the GitHub PR for the
current branch in your browser. It finds draft, open, merged, and closed PRs.

## Requirements

- The [GitHub CLI](https://cli.github.com/) (`gh`), signed in with `gh auth login`.
- macOS, because the plugin uses `open`.

## Install

```sh
git clone https://github.com/SoloUnity/opencode-v2-open-github-pr.git \
  ~/.config/opencode/plugins/opencode-v2-open-github-pr
```

Add the plugin to `~/.config/opencode/cli.json`, then restart OpenCode:

```json
{
  "plugins": ["./plugins/opencode-v2-open-github-pr"]
}
```

The command is also in the command palette as **Open GitHub PR**.
