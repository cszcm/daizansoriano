# Blog personal en Jekyll

Este repo es una base sencilla para GitHub Pages con un tema zen.

## Arranque rápido

1. Cambia `title`, `description`, `url` y `author` en `_config.yml`.
2. Edita `about.md`.
3. Sube el repo a GitHub y activa Pages (branch `main`, carpeta `/`).

## Desarrollo local (opcional)

```bash
bundle install
bundle exec jekyll serve
```

## Importar desde WordPress

Tienes dos rutas. La más completa es WXR (exportación de WordPress), que trae categorías, etiquetas y adjuntos.

### Opción A: Archivo WXR (recomendada)

1. En WordPress: Herramientas → Exportar → Todo el contenido.
2. Guarda el `.xml` en este repo (por ejemplo `import/wordpress.xml`).
3. Instala la gema de importación y ejecuta:

```bash
gem install jekyll-import
jekyll import wordpress \
  --source import/wordpress.xml \
  --no-fetch-images false
```

Esto crea entradas en `_posts/` con categorías y etiquetas. Las imágenes se descargan al ejecutarse (requiere red).

### Opción B: RSS/Atom

Si solo tienes un RSS, se puede convertir con:

```bash
gem install jekyll-import
jekyll import rss --source https://tu-blog.com/feed/ 
```

Esto importará posts y etiquetas si vienen en el feed, pero puede perder categorías y adjuntos.

## Notas sobre imágenes

- Si tienes muchas imágenes, es mejor usar la exportación WXR y permitir descarga de adjuntos.
- Otra alternativa es copiar manualmente `wp-content/uploads` a `assets/uploads/` y ajustar rutas.

## Limpieza

Cuando tengas tus entradas reales, borra el ejemplo en `_posts/2024-01-01-bienvenido.md`.

## Categorías y etiquetas (criterio)

Para que el archivo del blog sea coherente (y evitar duplicados por tildes/guiones), usamos este criterio:

- `categories`: 1 categoría por entrada (lista con un único valor).
- `tags`: 3–5 etiquetas temáticas por entrada.
- Estilo de `tags`: minúsculas, sin tildes, sin guiones; usar espacios si hace falta.

Ejemplo:

    categories: ["Comunidad"]
    tags: ["sangha", "soto zen", "secularizacion", "camino medio"]

### Categorías usadas

Actualmente el blog usa estas categorías (mantenerlas tal cual para no fragmentar el archivo):

- Comunidad
- Etica
- Psicologia
- Practica
- Zen
- Sociedad
- Paz
- Cine

### Tags canónicos (sugeridos)

Si un tema encaja, prioriza estas etiquetas antes de inventar variantes:

- budismo, soto zen, zazen, sangha
- compasion, interdependencia, presencia, no dualidad, discernimiento
- paz, guerra, no violencia, violencia
- democracia, gobernanza, autoridad
- psicologia, sesgo cognitivo, sesgo de confirmacion, confianza, buenismo
- tecnologia, IA, etica

Nota: si aparece una nueva etiqueta, intenta que siga el mismo estilo (sin tildes/guiones) y que no duplique otra existente (p. ej. compasion en vez de compasión).

## Contador de visitas por entrada

El blog incluye un contador de visitas por post, compatible con GitHub Pages, mediante servicios externos ligeros (`countapi.xyz` y fallback a `counterapi.dev`).

### Cómo funciona

- Cada entrada incrementa su propio contador al cargar la página.
- El contador se identifica por la URL del post.
- Si un servicio no responde, se intenta automáticamente con el siguiente proveedor.
- Si todos fallan o el navegador bloquea la petición, se muestra `No disponible`.

### Desactivar en un post

Añade en el front matter:

```yaml
views: false
```

Por defecto, si no se define `views`, el contador se muestra.

### Archivo relacionado

- Include del contador: `_includes/post-views.html`

## Audio MP3 en la web

En cada post, la web aplica esta lógica automáticamente:

1. Si existe un MP3 en `audio/` para esa entrada, se muestra el reproductor HTML5 e intenta reproducir automáticamente.
2. Si no existe MP3, no se muestra reproductor de audio.

### Ruta esperada del MP3

Debe reflejar la estructura de `_posts/`:

- Post: `_posts/2026/2026-01-24-mi-post.md`
- Audio: `audio/2026/2026-01-24-mi-post.mp3`

Nota: algunos navegadores bloquean autoplay sin interacción del usuario. En ese caso, el reproductor aparece listo y solo requiere pulsar `play`.

### Descarga del MP3

Cuando hay audio pregrabado para una entrada, el reproductor muestra también un enlace `Descargar audio MP3`.

### Reanudar reproducción

Cuando pausas un MP3, el navegador guarda la posición de esa entrada y al volver al post permite retomar desde ese punto.
