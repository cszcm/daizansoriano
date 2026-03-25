---
layout: default
title: "Xin Xin Ming · Versos"
permalink: /xin-xin-ming/versos/
---

<section class="archive">
  <p class="post-meta">Xin Xin Ming</p>
  <h1>Índice de versos</h1>
  <p>
    Cada verso se presenta como una unidad independiente, con su comentario y navegación
    correlativa para lectura lineal o consulta puntual.
  </p>

  <p>
    <a class="pill" href="{{ '/xin-xin-ming/' | relative_url }}">Inicio Xin Xin Ming</a>
    <a class="pill is-filled" href="{{ '/xin-xin-ming/lectura/' | relative_url }}">Lectura seguida</a>
  </p>

  {% assign versos = site.xinxinming_versos | sort: "verse_no" %}
  <div class="post-grid">
    {% for verso in versos %}
      <article class="post-card post-card--linked">
        <a class="post-card__link" href="{{ verso.url | relative_url }}">
          <h3>{{ verso.title }}</h3>
          <p>{{ verso.verse_text | truncate: 170 }}</p>
        </a>
      </article>
    {% endfor %}
  </div>
</section>
