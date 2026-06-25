# vesktop-bypass-shouldNotify

> [!WARNING]
> This plugin was vibecoded. The patch pattern may break on Discord updates.
> If it stops working, open DevTools (`Ctrl+Shift+I`) and run:
> ```js
> Vencord.Webpack.findByCode(".SUPPRESS_NOTIFICATIONS))").toString()
> ```
> Find the `"dnd"` status check and update the `match` regex in `bypass-dnd.ts`.

A Vencord userplugin that bypasses Discord's client-side DnD notification suppression, allowing desktop notifications to show regardless of your Discord status.

## Usage

Add to your flake inputs:

```nix
bypass-dnd.url = "github:isneru/vesktop-bypass-shouldNotify";
```

Override `pkgs.vencord` with the plugin injected at build time:

```nix
let
  customVencord = pkgs.vencord.overrideAttrs (old: {
    preBuild = (old.preBuild or "") + ''
      cp ${inputs.bypass-dnd.plugin} src/userplugins/bypass-dnd.ts
    '';
  });
in
{
  programs.vesktop.package = pkgs.vesktop.override { vencord = customVencord; };
  programs.vesktop.vencord.useSystem = true;
}
```
