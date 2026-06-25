{
  description = "Vencord userplugin: bypass Discord DnD notification suppression";
  outputs = { self }: {
    plugin = ./bypass-dnd.ts;
  };
}
