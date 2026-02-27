#!/usr/bin/env bash
set -euo pipefail

LIMIT="${1:-30}"

if ! [[ "$LIMIT" =~ ^[0-9]+$ ]]; then
  echo "Uso: $0 [N]"
  echo "  N = numero de blobs mas pesados a listar (por defecto 30)"
  exit 1
fi

echo "== Tamano del repositorio (objetos git) =="
git count-objects -vH
echo

echo "== Blobs historicos mas pesados (bytes path) =="
git rev-list --objects --all \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
  | awk '$1=="blob" {print $3 " " $4}' \
  | sort -nr \
  | awk -v limit="$LIMIT" 'NR<=limit {print}'
