# Limpieza de historial git (preparada)

Este documento deja listo el procedimiento para reducir tamano historico del repo con `git filter-repo`.

## 1) Auditoria rapida

```bash
bash scripts/audit-git-history-size.sh 30
```

## 2) Respaldo obligatorio antes de reescribir historial

```bash
ts=$(date +%Y%m%d-%H%M%S)
git branch "backup/pre-filter-repo-$ts"
git tag "backup/pre-filter-repo-$ts"
```

## 3) Instalar `git filter-repo` (si falta)

Ejemplo Debian/Ubuntu:

```bash
sudo apt-get install -y git-filter-repo
```

Si no tienes permisos de root, instala por `pipx` o en otro entorno.

## 4) Escenarios de limpieza

### A) Conservador: quitar historial de `node_modules` (baja ganancia)

```bash
git filter-repo --path node_modules --invert-paths
```

### B) Agresivo: quitar historico multimedia pesado (alta ganancia)

Solo ejecutar si ya migraste audio/video a almacenamiento externo/CDN o Git LFS.

```bash
git filter-repo \
  --path assets/mp3 \
  --path audio \
  --invert-paths
```

## 5) Push de historia reescrita

```bash
git push origin --force --all
git push origin --force --tags
```

## 6) Coordinacion de equipo (importante)

- Todos los clones existentes deben resincronizarse (clon nuevo recomendado).
- No mezclar ramas antiguas con ramas tras reescritura.
