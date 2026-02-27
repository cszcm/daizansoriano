---
layout: default
title: "Xin Xin Ming"
permalink: /xin-xin-ming/
---

<section class="archive">
  <p class="post-meta">Libro</p>
  <h1>Xin Xin Ming</h1>
  {% if site.xinxinming_meta.cover_image %}
    <figure class="xxm-cover">
      <img
        src="{{ site.xinxinming_meta.cover_image | relative_url }}"
        alt="{{ site.xinxinming_meta.cover_alt | default: 'Portada de Xin Xin Ming' }}"
        loading="eager"
        decoding="async"
      >
    </figure>
  {% endif %}
  <p>
    Esta sección reúne el contenido del libro en capítulos navegables para lectura web.
    Las imágenes se han omitido en esta versión.
  </p>
  {% if site.xinxinming_meta.buy_url %}
    <p>
      <a
        class="pill is-filled"
        href="{{ site.xinxinming_meta.buy_url }}"
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
      >{{ site.xinxinming_meta.buy_label | default: "Comprar el libro en Amazon" }}</a>
    </p>
  {% endif %}

  {% assign sections = site.xinxinming | sort: "xxm_order" %}
  <div class="post-grid">
    {% for section in sections %}
      <article class="post-card">
        <p class="post-meta">Sección {{ section.xxm_order }}</p>
        <h3><a href="{{ section.url | relative_url }}">{{ section.title }}</a></h3>
        <p>{{ section.excerpt | strip_html | strip_newlines | truncate: 170 }}</p>
      </article>
    {% endfor %}
  </div>
</section>
