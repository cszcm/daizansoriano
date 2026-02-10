---
layout: default
title: "Etiquetas"
permalink: /tags/
---

<section class="tags">
  {% assign podcast_items = site.podcast | sort: "date" | reverse %}
  {% assign tags_joined = "" %}
  {% for post in podcast_items %}
    {% for tag in post.tags %}
      {% assign tags_joined = tags_joined | append: tag | append: "||" %}
    {% endfor %}
  {% endfor %}
  {% assign tags = tags_joined | split: "||" | uniq | sort %}
  {% for tag in tags %}
    {% unless tag == "" %}
      <h2 id="{{ tag | slugify }}">{{ tag }}</h2>
      <ul>
      {% for post in podcast_items %}
        {% if post.tags contains tag %}
          <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
        {% endif %}
      {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
</section>
