---
layout: default
title: "Meditacion zen y budismo Soto Zen"
description: "Reflexiones, ensenanzas y recursos de meditacion zen y budismo Soto Zen de Daizan Soriano."
permalink: /
image: /assets/daizan.jpg
---

{% assign blog_items = site.posts | sort: "date" | reverse %}
{% assign featured_post = blog_items | first %}
{% assign recent_posts = blog_items | slice: 1, 3 %}
{% assign podcast_items = site.podcast | sort: "date" | reverse %}
{% assign recent_podcast_items = podcast_items | slice: 0, 3 %}

{% if featured_post %}
{% assign featured_post_image = featured_post.image | default: '/assets/daizan.jpg' %}
{% if featured_post_image == '/assets/logo.png' %}
{% assign featured_post_image = '/assets/daizan.jpg' %}
{% endif %}
{% if featured_post_image contains '://' %}
{% assign featured_post_image_url = featured_post_image %}
{% else %}
{% assign featured_post_image_url = featured_post_image | relative_url %}
{% endif %}

<section class="section-heading">
  <p class="post-meta">Budismo Soto Zen</p>
  <h1 class="post-title">Meditacion zen y budismo Soto Zen</h1>
  <p class="post-subtitle">Textos, audios y recursos de practica de Daizan Soriano para integrar el Dharma en la vida cotidiana.</p>
</section>

<section class="home-featured-post">
  <div class="home-featured-post__media">
    <a href="{{ featured_post.url | relative_url }}" aria-label="Ir a la entrada {{ featured_post.title }}">
      {% if featured_post_image == '/assets/daizan.jpg' %}
      <img
        src="{{ '/assets/daizan-264.webp' | relative_url }}"
        srcset="{{ '/assets/daizan-132.webp' | relative_url }} 132w, {{ '/assets/daizan-264.webp' | relative_url }} 264w"
        sizes="132px"
        alt="Imagen de la entrada {{ featured_post.title }}"
        width="132"
        height="132"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      >
      {% else %}
      <img src="{{ featured_post_image_url }}" alt="Imagen de la entrada {{ featured_post.title }}" width="132" height="132" loading="eager" fetchpriority="high" decoding="async">
      {% endif %}
    </a>
  </div>
  <div class="home-featured-post__content">
    <p class="home-featured-post__kicker">Última entrada</p>
    <h2>{{ featured_post.title }}</h2>
    <p class="post-meta">
      {{ featured_post.date | date: "%d %b %Y" }}
      {% if featured_post.categories %} · {{ featured_post.categories | join: ", " }}{% endif %}
    </p>
    <p class="home-featured-post__summary">
      {% if featured_post.description %}
        {{ featured_post.description | strip_html | strip_newlines | truncate: 180 }}
      {% else %}
        {{ featured_post.excerpt | strip_html | strip_newlines | truncate: 180 }}
      {% endif %}
    </p>
    <div class="home-featured-post__actions">
      <a class="pill is-filled" href="{{ featured_post.url | relative_url }}">Leer entrada</a>
    </div>
  </div>
</section>
{% endif %}

<section class="post-list" aria-label="Ultimos textos">
  <header class="section-heading">
    <p class="post-meta">Textos</p>
    <h2 class="post-title">Ultimos articulos</h2>
    <p class="post-subtitle">Las entradas mas recientes para quien quiere leer y seguir el hilo actual de la publicacion.</p>
  </header>
  <div class="post-grid">
    {% for post in recent_posts %}
      <article class="post-card">
        <p class="post-meta">{{ post.date | date: "%d %b %Y" }}{% if post.categories %} · {{ post.categories | join: ", " }}{% endif %}</p>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        {% assign post_summary = post.description | default: post.excerpt | strip_html | strip_newlines %}
        {% if post_summary == "" %}
          {% assign post_summary = post.content | strip_html | strip_newlines %}
        {% endif %}
        <p>{{ post_summary | truncate: 180 }}</p>
      </article>
    {% endfor %}
  </div>
  <div class="post-list__footer">
    <a class="pill is-filled" href="{{ '/archive/' | relative_url }}">Ver archivo completo</a>
  </div>
</section>

<section class="post-list" aria-label="Ultimos audios">
  <header class="section-heading">
    <p class="post-meta">Audio</p>
    <h2 class="post-title">Ultimos audios</h2>
    <p class="post-subtitle">Una entrada directa para escuchar ensenanzas y meditaciones sin tener que buscarlas en todo el archivo.</p>
  </header>
  <div class="post-grid">
    {% for item in recent_podcast_items %}
      <article class="post-card">
        <p class="post-meta">{{ item.date | date: "%d %b %Y" }}{% if item.episode %} · Episodio {{ item.episode }}{% endif %}</p>
        <h3><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h3>
        {% assign item_summary = item.description | default: item.excerpt | strip_html | strip_newlines %}
        {% if item_summary == "" %}
          {% assign item_summary = item.content | strip_html | strip_newlines %}
        {% endif %}
        <p>{{ item_summary | truncate: 180 }}</p>
      </article>
    {% endfor %}
  </div>
  <div class="post-list__footer">
    <a class="pill" href="{{ '/podcast/' | relative_url }}">Ir al podcast</a>
  </div>
</section>

<section class="post-list" aria-label="Archivos tematicos destacados">
  <header class="section-heading">
    <p class="post-meta">Explorar</p>
    <h2 class="post-title">Puertas de entrada al archivo</h2>
    <p class="post-subtitle">En lugar de recorrer una lista interminable, puedes entrar por conversaciones, cronicas, textos generales o navegacion tematica.</p>
  </header>
  <div class="post-grid">
    <article class="post-card">
      <p class="post-meta">Archivo tematico</p>
      <h3><a href="{{ '/entrevistas/' | relative_url }}">Entrevistas y conversaciones</a></h3>
      <p>Recuperacion de entrevistas, apariciones en medios y conversaciones sobre meditacion zen, practica y budismo Soto Zen.</p>
    </article>

    <article class="post-card">
      <p class="post-meta">Archivo tematico</p>
      <h3><a href="{{ '/cronicas/' | relative_url }}">Cronicas de retiros y practica</a></h3>
      <p>Memorias de retiros, textos de comunidad y cronicas recuperadas para conservar la experiencia viva de la practica.</p>
    </article>

    <article class="post-card">
      <p class="post-meta">Archivo</p>
      <h3><a href="{{ '/archive/' | relative_url }}">Archivo completo</a></h3>
      <p>Todos los articulos, audios y piezas recuperadas ordenados cronologicamente para explorar el fondo completo del sitio.</p>
    </article>

    <article class="post-card">
      <p class="post-meta">Navegacion tematica</p>
      <h3><a href="{{ '/categorias/' | relative_url }}">Categorias y etiquetas</a></h3>
      <p>Una entrada util cuando buscas un tema concreto y prefieres navegar por afinidad en lugar de hacerlo por fecha.</p>
    </article>
  </div>
</section>

{% include newsletter-cta.html
  title="Recibe cada nueva enseñanza por correo"
  text="Sin ruido, sin spam. Solo nuevas publicaciones y audios."
  button_label="Quiero recibirlas"
%}
