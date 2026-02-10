---
layout: default
title: "Inicio"
---

<section class="post-list">
  {% assign podcast_items = site.podcast | where_exp: "item", "item.source_url == nil" | sort: "date" | reverse %}
  <div class="post-grid">
    {% for post in podcast_items %}
      <article class="post-card">
        <p class="post-meta">{{ post.date | date: "%d %b %Y" }}{% if post.categories %} · {{ post.categories | join: ", " }}{% endif %}</p>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.excerpt | strip_html | strip_newlines | truncate: 180 }}</p>
      </article>
    {% endfor %}
  </div>
</section>
