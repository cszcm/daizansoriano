---
layout: default
title: "Categorías"
permalink: /categorias/
---

<section class="tags">
  {% assign podcast_items = site.podcast | sort: "date" | reverse %}
  {% assign categories_joined = "" %}
  {% for post in podcast_items %}
    {% for category in post.categories %}
      {% assign categories_joined = categories_joined | append: category | append: "||" %}
    {% endfor %}
  {% endfor %}
  {% assign categories = categories_joined | split: "||" | uniq | sort %}
  {% for category in categories %}
    {% unless category == "" %}
      <h2 id="{{ category | slugify }}">{{ category }}</h2>
      <ul>
      {% for post in podcast_items %}
        {% if post.categories contains category %}
          <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
        {% endif %}
      {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
</section>
