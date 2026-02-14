---
layout: default
title: "Archivo"
permalink: /archive/
---

<section class="archive">
  {% include content-filter-controls.html %}
  {% assign all_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% for post in all_items %}
    {% capture content_type %}{% include content-item-type.html post=post %}{% endcapture %}
    {% assign content_type = content_type | strip %}
    {% capture content_label %}{% include content-item-label.html type=content_type %}{% endcapture %}
    {% assign content_label = content_label | strip %}
    <article data-content-item data-content-type="{{ content_type }}">
      <p class="post-meta">{{ post.date | date: "%d %b %Y" }} · {{ content_label }}</p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    </article>
  {% endfor %}
</section>

{% include content-filter-script.html %}
