# vesktop-bypass-shouldNotify

> [!WARNING]
> This plugin was vibecoded. The patch pattern may break on Discord updates.
> If it stops working, open DevTools (`Ctrl+Shift+I`) and run:
>
> ```js
> Vencord.Webpack.findByCode(".SUPPRESS_NOTIFICATIONS))").toString();
> ```
>
> Find the `"dnd"` status check and update the `match` regex in `bypass-dnd.ts`.

A Vencord userplugin that bypasses Discord's client-side DnD notification suppression, allowing desktop notifications to show regardless of your Discord status.

## Usage

Fetch the repo with `builtins.fetchGit` and inject the plugin at Vencord build time:

```nix
let
  bypassDnd = builtins.fetchGit {
    url = "https://github.com/isneru/vesktop-bypass-shouldNotify";
    rev = "<commit-hash>";
  };

  customVencord = pkgs.vencord.overrideAttrs (old: {
    preBuild = (old.preBuild or "") + ''
      mkdir -p src/userplugins
      cp ${bypassDnd}/bypass-dnd.ts src/userplugins/bypass-dnd.ts
    '';
  });
in
{
  programs.vesktop.package = pkgs.vesktop.override { vencord = customVencord; };
  programs.vesktop.vencord.useSystem = true;
}
```
