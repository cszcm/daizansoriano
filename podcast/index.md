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
  {% for item in podcast_items %}
    <article>
      <p class="post-meta">
        {{ item.date | date: "%d %b %Y" }}
        {% if item.episode %} · Episodio {{ item.episode }}{% endif %}
        {% if item.duration %} · {{ item.duration }}{% endif %}
      </p>
      <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
      {% if item.description %}
        <p>{{ item.description | strip_html | strip_newlines | truncate: 180 }}</p>
      {% else %}
        <p>{{ item.excerpt | strip_html | strip_newlines | truncate: 180 }}</p>
      {% endif %}
    </article>
  {% endfor %}
</section>
