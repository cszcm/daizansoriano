---
layout: default
title: "Inicio"
---

{% assign audio_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
{% assign featured_audio_url = "" %}
{% assign featured_audio_item = nil %}
{% for item in audio_items %}
  {% assign item_audio_url = "" %}
  {% if item.audio_url %}
    {% assign item_audio_url = item.audio_url %}
  {% else %}
    {% if item.collection == "posts" %}
      {% assign item_audio_rel = item.path | remove_first: "_posts/" | replace: ".markdown", ".mp3" | replace: ".md", ".mp3" %}
    {% else %}
      {% assign item_audio_rel = item.path | remove_first: "_podcast/" | replace: ".markdown", ".mp3" | replace: ".md", ".mp3" %}
    {% endif %}
    {% assign item_audio_path = "/audio/" | append: item_audio_rel %}
    {% for static_file in site.static_files %}
      {% if static_file.path == item_audio_path %}
        {% assign item_audio_url = item_audio_path %}
        {% break %}
      {% endif %}
    {% endfor %}
  {% endif %}
  {% if item_audio_url != "" %}
    {% assign featured_audio_item = item %}
    {% assign featured_audio_url = item_audio_url %}
    {% break %}
  {% endif %}
{% endfor %}

{% if featured_audio_item and featured_audio_url != "" %}
{% assign featured_audio_image = featured_audio_item.image | default: site.podcast.image | default: '/assets/daizan.jpg' %}
{% if featured_audio_image contains '://' %}
  {% assign featured_audio_image_url = featured_audio_image %}
{% else %}
  {% assign featured_audio_image_url = featured_audio_image | relative_url %}
{% endif %}
<section class="home-latest-audio">
  <div class="home-latest-audio__media">
    <a href="{{ featured_audio_item.url | relative_url }}" aria-label="Ir al episodio {{ featured_audio_item.title }}">
      {% if featured_audio_image == '/assets/daizan.jpg' %}
      <picture>
        <source type="image/webp" srcset="{{ '/assets/daizan.webp' | relative_url }}">
        <img src="{{ featured_audio_image_url }}" alt="Portada de {{ featured_audio_item.title }}" loading="eager" decoding="async">
      </picture>
      {% else %}
      <img src="{{ featured_audio_image_url }}" alt="Portada de {{ featured_audio_item.title }}" loading="eager" decoding="async">
      {% endif %}
    </a>
  </div>
  <div class="home-latest-audio__content">
    <p class="home-latest-audio__kicker">Último audio</p>
    <h2>{{ featured_audio_item.title }}</h2>
    <p class="post-meta">
      {{ featured_audio_item.date | date: "%d %b %Y" }}
      {% if featured_audio_item.categories %} · {{ featured_audio_item.categories | join: ", " }}{% endif %}
      {% if featured_audio_item.duration %} · {{ featured_audio_item.duration }}{% endif %}
    </p>
    <p class="home-latest-audio__summary">
      {% if featured_audio_item.description %}
        {{ featured_audio_item.description | strip_html | strip_newlines | truncate: 180 }}
      {% else %}
        {{ featured_audio_item.excerpt | strip_html | strip_newlines | truncate: 180 }}
      {% endif %}
    </p>
    <div class="home-latest-audio__actions">
      <a
        class="pill is-filled"
        href="{{ featured_audio_url | relative_url }}"
        data-global-audio-trigger
        data-audio-src="{{ featured_audio_url | relative_url }}"
        data-audio-title="{{ featured_audio_item.title | escape }}"
        data-audio-page-url="{{ featured_audio_item.url | relative_url }}"
        aria-label="Escuchar ahora {{ featured_audio_item.title }} en el mini reproductor"
      >Escuchar ahora</a>
      <a class="pill" href="{{ featured_audio_item.url | relative_url }}">Ver episodio</a>
    </div>
  </div>
</section>
{% endif %}

<section class="post-list">
  {% assign blog_items = site.posts | sort: "date" | reverse %}
  <div class="post-grid">
    {% for post in blog_items %}
      <article class="post-card">
        <p class="post-meta">{{ post.date | date: "%d %b %Y" }}{% if post.categories %} · {{ post.categories | join: ", " }}{% endif %}</p>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.excerpt | strip_html | strip_newlines | truncate: 180 }}</p>
      </article>
    {% endfor %}
  </div>
</section>

{% include newsletter-cta.html
  title="Recibe cada nueva enseñanza por correo"
  text="Sin ruido, sin spam. Solo nuevas publicaciones y audios."
  button_label="Quiero recibirlas"
%}
