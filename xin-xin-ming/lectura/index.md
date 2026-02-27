---
layout: default
title: "Xin Xin Ming · Lectura seguida"
permalink: /xin-xin-ming/lectura/
---

<section class="archive">
  <p class="post-meta">Xin Xin Ming</p>
  <h1>Lectura seguida</h1>
  <p>
    Recorrido continuo de todos los versos con su comentario, manteniendo un formato uniforme.
  </p>

  <p>
    <a class="pill" href="{{ '/xin-xin-ming/' | relative_url }}">Inicio Xin Xin Ming</a>
    <a class="pill" href="{{ '/xin-xin-ming/versos/' | relative_url }}">Índice de versos</a>
  </p>

  {% assign versos = site.xinxinming_versos | sort: "verse_no" %}
  {% for verso in versos %}
    <article class="post-card" id="v{{ verso.verse_id }}">
      <h3><a href="{{ verso.url | relative_url }}">{{ verso.title }}</a></h3>
      <div class="post-content">
        {{ verso.content | markdownify }}
      </div>
    </article>
  {% endfor %}
</section>
