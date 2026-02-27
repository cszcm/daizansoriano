---
layout: default
title: "Podcast"
permalink: /podcast/
---

<section class="archive">
  {% assign podcast_web_image = site.podcast_meta.web_image | default: '/assets/daizan.jpg' %}
  <div class="podcast-header-image">
    <img src="{{ '/assets/cabecera.png' | relative_url }}" alt="Cabecera del podcast" loading="eager" decoding="async">
  </div>
  <p>
    <a class="pill" href="{{ '/podcast-plataformas/' | relative_url }}">Plataformas de escucha</a>
  </p>
  {% assign podcast_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% assign rendered_total = 0 %}
  {% for item in podcast_items %}
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
      {% assign rendered_total = rendered_total | plus: 1 %}
    {% endif %}
  {% endfor %}
  <div class="podcast-spotify-list">
    {% assign rendered_count = 0 %}
    {% for item in podcast_items %}
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
      {% assign rendered_count = rendered_count | plus: 1 %}
      {% assign rendered_rank = rendered_total | minus: rendered_count | plus: 1 %}
      <article class="podcast-spotify-item">
        <div class="podcast-spotify-rank" aria-hidden="true">{{ rendered_rank }}</div>

        <a class="podcast-spotify-cover" href="{{ item.url | relative_url }}" aria-label="Ir al episodio {{ item.title }}">
          {% assign item_cover_image = item.image | default: podcast_web_image %}
          {% if item_cover_image == '/assets/logo.png' %}
            {% assign item_cover_image = podcast_web_image %}
          {% endif %}
          {% if item_cover_image contains '://' %}
            {% assign item_cover_url = item_cover_image %}
          {% else %}
            {% assign item_cover_url = item_cover_image | relative_url %}
          {% endif %}
          <img src="{{ item_cover_url }}" alt="Portada de {{ item.title }}" loading="lazy" decoding="async">
        </a>

        <div class="podcast-spotify-body">
          <p class="post-meta">
            {{ item.date | date: "%d %b %Y" }}
            {% if item.episode %} · Episodio {{ item.episode }}{% endif %}
          </p>
          <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
          {% if item.description %}
            <p>{{ item.description | strip_html | strip_newlines | truncate: 160 }}</p>
          {% else %}
            <p>{{ item.excerpt | strip_html | strip_newlines | truncate: 160 }}</p>
          {% endif %}
        </div>

        <div class="podcast-spotify-actions">
          {% if item.duration %}
            <span class="podcast-spotify-duration">{{ item.duration }}</span>
          {% endif %}
          <a
            class="pill is-filled podcast-spotify-play"
            href="{{ item_audio_url | relative_url }}"
            data-global-audio-trigger
            data-audio-src="{{ item_audio_url | relative_url }}"
            data-audio-title="{{ item.title | escape }}"
            data-audio-page-url="{{ item.url | relative_url }}"
            aria-label="Reproducir {{ item.title }} en el mini reproductor"
          >▶ Escuchar</a>
        </div>
      </article>
      {% endif %}
    {% endfor %}
    {% if rendered_count == 0 %}
      <p>No hay episodios publicados todavía.</p>
    {% endif %}

  </div>
</section>
