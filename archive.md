---
layout: default
title: "Archivo"
permalink: /archive/
---

<section class="archive">
  {% assign podcast_items = site.podcast | sort: "date" | reverse %}
  {% for post in podcast_items %}
    <article>
      <p class="post-meta">{{ post.date | date: "%d %b %Y" }}</p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    </article>
  {% endfor %}
</section>
