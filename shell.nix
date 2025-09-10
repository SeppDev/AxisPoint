{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  buildInputs = [
    pkgs.ruby
    pkgs.nodejs
    pkgs.yarn
    pkgs.sqlite
    pkgs.libyaml # ✅ Required for psych
    pkgs.gnumake
    pkgs.gcc
    pkgs.pkg-config
    pkgs.zlib
    pkgs.openssl
    pkgs.readline
  ];

  shellHook = ''
    export GEM_HOME=$HOME/.gem
    export PATH=$GEM_HOME/bin:$PATH
  '';
}
