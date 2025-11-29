{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  languages.typescript.enable = true;

  packages = with pkgs; [
    pnpm
    nodejs
  ];
}
