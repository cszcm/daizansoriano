---
layout: default
title: "Categorias de meditacion zen y budismo"
description: "Indice por categorias para encontrar articulos y audios sobre meditacion zen, practica y budismo Soto Zen."
permalink: /categorias/
---

<section class="tags">
  <header class="section-heading">
    <p class="post-meta">Navegacion tematica</p>
    <h1 class="post-title">Categorias</h1>
    <p class="post-subtitle">Encuentra contenidos agrupados por grandes temas de practica y estudio.</p>
  </header>
  {% include content-filter-controls.html %}
  {% assign all_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% assign categories_joined = "" %}
  {% for post in all_items %}
    {% for category in post.categories %}
      {% assign categories_joined = categories_joined | append: category | append: "||" %}
    {% endfor %}
  {% endfor %}
  {% assign categories = categories_joined | split: "||" | uniq | sort %}
  {% for category in categories %}
    {% unless category == "" %}
      <h2 id="{{ category | slugify }}">{{ category }}</h2>
      <ul>
      {% for post in all_items %}
        {% if post.categories contains category %}
          {% capture content_type %}{% include content-item-type.html post=post %}{% endcapture %}
          {% assign content_type = content_type | strip %}
          {% capture content_label %}{% include content-item-label.html type=content_type %}{% endcapture %}
          {% assign content_label = content_label | strip %}
          <li data-content-item data-content-type="{{ content_type }}"><a href="{{ post.url | relative_url }}">{{ post.title }}</a> · <span class="post-meta">{{ content_label }}</span></li>
        {% endif %}
      {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
</section>

{% include content-filter-script.html %}
