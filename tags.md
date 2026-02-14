---
layout: default
title: "Etiquetas"
permalink: /tags/
---

<section class="tags">
  {% include content-filter-controls.html %}
  {% assign all_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% assign tags_joined = "" %}
  {% for post in all_items %}
    {% for tag in post.tags %}
      {% assign tags_joined = tags_joined | append: tag | append: "||" %}
    {% endfor %}
  {% endfor %}
  {% assign tags = tags_joined | split: "||" | uniq | sort %}
  {% for tag in tags %}
    {% unless tag == "" %}
      <h2 id="{{ tag | slugify }}">{{ tag }}</h2>
      <ul>
      {% for post in all_items %}
        {% if post.tags contains tag %}
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
