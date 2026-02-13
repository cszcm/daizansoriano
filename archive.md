---
layout: default
title: "Archivo"
permalink: /archive/
---

<section class="archive">
  {% include content-filter-controls.html %}
  {% assign all_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% for post in all_items %}
    {% assign is_audio_item = post.collection == "podcast" %}
    <article data-content-item data-content-type="{% if is_audio_item %}audio{% else %}article{% endif %}">
      <p class="post-meta">{{ post.date | date: "%d %b %Y" }} · {% if is_audio_item %}Audio{% else %}Artículo{% endif %}</p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    </article>
  {% endfor %}
</section>

{% include content-filter-script.html %}
