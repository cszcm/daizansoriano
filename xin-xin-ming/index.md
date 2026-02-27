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
    El contenido de esta sección forma parte del libro <em>Xin Xin Ming</em>. Aquí se presenta
    en formato web, reorganizado por versos, para facilitar su estudio y consulta.
  </p>
  <p>
    Cada página reúne un verso y su comentario correspondiente, manteniendo la continuidad del
    texto original publicado en el libro.
  </p>

  <p>
    <a class="pill is-filled" href="{{ '/xin-xin-ming/lectura/' | relative_url }}">Leer seguido</a>
    <a class="pill" href="{{ '/xin-xin-ming/versos/' | relative_url }}">Explorar versos</a>
    <a class="pill" href="{{ '/xin-xin-ming/apendices/' | relative_url }}">Apéndices</a>
    {% if site.xinxinming_meta.buy_url %}
      <a
        class="pill"
        href="{{ site.xinxinming_meta.buy_url }}"
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
      >{{ site.xinxinming_meta.buy_label | default: "Comprar en Amazon" }}</a>
    {% endif %}
  </p>

  {% assign versos = site.xinxinming_versos | sort: "verse_no" %}
  {% if versos.size > 0 %}
    <p class="post-meta">Versos disponibles: {{ versos.size }}</p>
    <div class="post-grid">
      {% for verso in versos limit: 6 %}
        <article class="post-card">
          <h3><a href="{{ verso.url | relative_url }}">{{ verso.title }}</a></h3>
          <p>{{ verso.verse_text | truncate: 170 }}</p>
        </article>
      {% endfor %}
    </div>
  {% endif %}
</section>
