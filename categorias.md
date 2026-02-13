---
layout: default
title: "Categorías"
permalink: /categorias/
---

<section class="tags">
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
          {% assign is_audio_item = post.collection == "podcast" %}
          <li data-content-item data-content-type="{% if is_audio_item %}audio{% else %}article{% endif %}"><a href="{{ post.url | relative_url }}">{{ post.title }}</a> · <span class="post-meta">{% if is_audio_item %}Audio{% else %}Artículo{% endif %}</span></li>
        {% endif %}
      {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
</section>

{% include content-filter-script.html %}
