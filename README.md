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

## Lector de artículos en audio (TTS)

El blog incluye un reproductor de lectura en voz alta basado en la Web Speech API del navegador. Se muestra automáticamente en cada post y lee el contenido del artículo sin depender de servicios externos ni backend.

### Qué incluye

- Reproductor integrado en cada post con controles `Leer`, `Pausa`, `Reanudar` y `Parar`.
- Idioma de lectura fijado a `es-ES` (sin selector de variantes).
- Control de velocidad con slider (reinicia lectura al cambiar velocidad mientras está hablando).
- Modo `Karaoke`: al activarlo, se resalta el bloque de texto a medida que avanza la lectura.
- Modo `Manos libres`: al activarlo, la página hace scroll automático durante la lectura.
- Detección de compatibilidad del navegador con fallback automático (mensaje + controles ocultos).
- Extracción de texto del contenido del post, excluyendo navegación y bloques no deseados.

### Compatibilidad

- Chrome y Edge: soporte generalmente más estable.
- Safari y Firefox: el soporte puede variar según versión, sistema operativo y voces disponibles.
- Si el navegador no soporta TTS, se muestra un mensaje y los controles no aparecen.

### Desactivar en un post

Añade en el front matter del post:

```yaml
tts: false
```

Por defecto, si no se define `tts`, el reproductor se muestra.

### Ajustar selector de contenido

El include `_includes/tts-player.html` extrae el texto en este orden:

1. `article`
2. `.post-content`
3. `.post`
4. `main`

Si tu tema usa otra estructura, edita el arreglo `selectors` dentro del script del include y coloca ahí tu selector principal.

### Archivos relacionados

- Include del reproductor: `_includes/tts-player.html`
- Inserción en layout de posts: `_layouts/post.html`

## Contador de visitas por entrada

El blog incluye un contador de visitas por post, compatible con GitHub Pages, mediante un servicio externo ligero (`countapi.xyz`).

### Cómo funciona

- Cada entrada incrementa su propio contador al cargar la página.
- El contador se identifica por la URL del post.
- Si el servicio no responde o el navegador bloquea la petición, se muestra `No disponible`.

### Desactivar en un post

Añade en el front matter:

```yaml
views: false
```

Por defecto, si no se define `views`, el contador se muestra.

### Archivo relacionado

- Include del contador: `_includes/post-views.html`
