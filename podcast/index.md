---
layout: default
title: "Podcast"
permalink: /podcast/
---

<section class="archive">
  <div class="podcast-header-image">
    <img src="{{ '/assets/cabecera.png' | relative_url }}" alt="Cabecera del podcast" loading="eager" decoding="async">
  </div>
  {% assign podcast_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
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
      <article class="podcast-spotify-item">
        <div class="podcast-spotify-rank" aria-hidden="true">{{ rendered_count }}</div>

        <a class="podcast-spotify-cover" href="{{ item.url | relative_url }}" aria-label="Ir al episodio {{ item.title }}">
          {% if item.image %}
            <img src="{{ item.image | relative_url }}" alt="Portada de {{ item.title }}" loading="lazy" decoding="async">
          {% else %}
            <span aria-hidden="true">♪</span>
          {% endif %}
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
