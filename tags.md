---
layout: default
title: "Etiquetas sobre zen, practica y Dharma"
description: "Indice de etiquetas para navegar articulos y episodios relacionados con temas concretos del budismo Soto Zen."
permalink: /tags/
---

<section class="tags">
  <header class="section-heading">
    <p class="post-meta">Indice tematico</p>
    <h1 class="post-title">Etiquetas</h1>
    <p class="post-subtitle">Accede a temas especificos y cruza articulos, audios y piezas recuperadas relacionadas.</p>
  </header>
  {% include content-filter-controls.html %}
  {% assign archive_items = site.archivo_recuperado | sort: "date" | reverse %}
  {% assign chronicle_items = site.cronicas_recuperadas | sort: "date" | reverse %}
  {% assign interview_items = site.entrevistas_recuperadas | sort: "date" | reverse %}
  {% assign all_items = site.podcast | concat: site.posts | concat: archive_items | concat: chronicle_items | concat: interview_items | sort: "date" | reverse %}
  {% assign tags_joined = "" %}
  {% for item in all_items %}
    {% for tag in item.tags %}
      {% assign tags_joined = tags_joined | append: tag | append: "||" %}
    {% endfor %}
  {% endfor %}
  {% assign tags = tags_joined | split: "||" | uniq | sort %}
  {% for tag in tags %}
    {% unless tag == "" %}
      <h2 id="{{ tag | slugify }}">{{ tag }}</h2>
      <ul>
      {% for item in all_items %}
        {% if item.tags contains tag %}
          {% capture content_type %}{% include content-item-type.html post=item %}{% endcapture %}
          {% assign content_type = content_type | strip %}
          {% capture content_label %}{% include content-item-label.html type=content_type %}{% endcapture %}
          {% assign content_label = content_label | strip %}
          <li data-content-item data-content-type="{{ content_type }}"><a href="{{ item.url | relative_url }}">{{ item.title }}</a> · <span class="post-meta">{{ content_label }}</span></li>
        {% endif %}
      {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
</section>

{% include content-filter-script.html %}
