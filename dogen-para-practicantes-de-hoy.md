---
layout: default
title: "Dogen para practicantes de hoy"
permalink: /series/dogen-para-practicantes-de-hoy/
published: false
---

<section class="archive">
  <article>
    <p class="post-meta">Serie en revisión</p>
    <h1>Dogen para practicantes de hoy</h1>
    <p>Esta página agrupa una serie de lecturas contemporáneas del <em>Eihei Shingi</em>. La serie y sus artículos están preparados como borradores para revisión antes de publicarse.</p>
  </article>

  {% assign series_posts = site.posts | where: "series_slug", "dogen-para-practicantes-de-hoy" | sort: "series_order" %}
  {% for post in series_posts %}
    <article>
      <p class="post-meta">
        {% if post.series_order == 0 %}Introducción{% else %}Artículo {{ post.series_order }}{% endif %}
      </p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      {% if post.description %}
        <p>{{ post.description }}</p>
      {% endif %}
    </article>
  {% endfor %}
</section>
