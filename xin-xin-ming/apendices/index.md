---
layout: default
title: "Xin Xin Ming · Apéndices"
permalink: /xin-xin-ming/apendices/
---

<section class="archive">
  <p class="post-meta">Xin Xin Ming</p>
  <h1>Apéndices</h1>
  <p>
    Material complementario del libro: dedicatoria, agradecimientos, prólogo, glosario,
    bibliografía y traducción completa.
  </p>

  <p>
    <a class="pill" href="{{ '/xin-xin-ming/' | relative_url }}">Inicio Xin Xin Ming</a>
    <a class="pill" href="{{ '/xin-xin-ming/versos/' | relative_url }}">Índice de versos</a>
    <a class="pill" href="{{ '/xin-xin-ming/lectura/' | relative_url }}">Lectura seguida</a>
  </p>

  {% assign apendices = site.xinxinming | where: "xxm_is_appendix", true | sort: "xxm_order" %}
  <div class="post-grid">
    {% for apendice in apendices %}
      <article class="post-card post-card--linked">
        <a class="post-card__link" href="{{ apendice.url | relative_url }}">
          <p class="post-meta">Apéndice {{ apendice.xxm_order }}</p>
          <h3>{{ apendice.title }}</h3>
          <p>{{ apendice.excerpt | strip_html | strip_newlines | truncate: 170 }}</p>
        </a>
      </article>
    {% endfor %}
  </div>
</section>
