---
layout: default
title: "Inicio"
---

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
