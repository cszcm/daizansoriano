---
layout: default
title: "Categorías"
permalink: /categorias/
---

<section class="tags">
  {% assign categories = site.categories | sort %}
  {% for category in categories %}
    <h2 id="{{ category[0] | slugify }}">{{ category[0] }}</h2>
    <ul>
      {% for post in category[1] %}
        <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
      {% endfor %}
    </ul>
  {% endfor %}
</section>
