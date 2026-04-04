---
layout: default
title: "Archivo de articulos y podcast"
description: "Archivo cronologico de articulos, audios y publicaciones de Daizan Soriano sobre meditacion zen y Dharma."
permalink: /archive/
---

<section class="archive">
  <header class="section-heading">
    <p class="post-meta">Archivo</p>
    <h1 class="post-title">Archivo de publicaciones</h1>
    <p class="post-subtitle">Explora en orden cronologico los articulos del blog, los episodios de audio y las piezas recuperadas del archivo antiguo.</p>
  </header>
  {% include content-filter-controls.html %}
  {% assign archive_pages = site.pages | where: "archive_entry", true | sort: "date" | reverse %}
  {% assign all_items = site.podcast | concat: site.posts | concat: archive_pages | sort: "date" | reverse %}
  {% for item in all_items %}
    {% capture content_type %}{% include content-item-type.html post=item %}{% endcapture %}
    {% assign content_type = content_type | strip %}
    {% capture content_label %}{% include content-item-label.html type=content_type %}{% endcapture %}
    {% assign content_label = content_label | strip %}
    <article data-content-item data-content-type="{{ content_type }}">
      <p class="post-meta">{{ item.date | date: "%d %b %Y" }} · {{ content_label }}</p>
      <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
    </article>
  {% endfor %}
</section>

{% include content-filter-script.html %}
