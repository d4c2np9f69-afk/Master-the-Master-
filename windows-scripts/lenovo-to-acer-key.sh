#!/bin/bash
# Prep the Lenovo to mount the Acer over SSH: ensure a key exists, install sshfs,
# and print the public key (which then gets added to the Acer's authorized keys).
set -u
if [ ! -f ~/.ssh/id_ed25519 ]; then
  ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_ed25519 -C "lenovo-to-acer" >/dev/null 2>&1
  echo "generated new key"
else
  echo "key already exists"
fi
if ! command -v sshfs >/dev/null 2>&1; then
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q sshfs >/dev/null 2>&1
fi
echo "sshfs: $(command -v sshfs || echo MISSING)"
echo "PUBKEY_START"
cat ~/.ssh/id_ed25519.pub
echo "PUBKEY_END"
