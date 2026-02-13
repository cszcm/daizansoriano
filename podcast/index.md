---
layout: default
title: "Podcast"
permalink: /podcast/
---

<section class="archive">
  {% assign podcast_items = site.podcast | sort: "date" | reverse %}
  {% if podcast_items.size == 0 %}
    <p>No hay episodios publicados todavía.</p>
  {% endif %}
  {% if podcast_items.size > 0 %}
  <div class="podcast-spotify-list">
    {% for item in podcast_items %}
      <article class="podcast-spotify-item">
        <div class="podcast-spotify-rank" aria-hidden="true">{{ forloop.index }}</div>

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
          {% if item.audio_url %}
            <a
              class="pill is-filled podcast-spotify-play"
              href="{{ item.audio_url | relative_url }}"
              data-global-audio-trigger
              data-audio-src="{{ item.audio_url | relative_url }}"
              data-audio-title="{{ item.title | escape }}"
              data-audio-page-url="{{ item.url | relative_url }}"
              aria-label="Reproducir {{ item.title }} en el mini reproductor"
            >▶ Escuchar</a>
          {% else %}
            <a class="pill is-filled podcast-spotify-play" href="{{ item.url | relative_url }}">▶ Escuchar</a>
          {% endif %}
        </div>
      </article>
    {% endfor %}

  </div>
  {% endif %}
</section>
