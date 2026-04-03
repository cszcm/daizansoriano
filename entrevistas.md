---
layout: default
title: "Entrevistas sobre meditacion zen y budismo"
description: "Archivo de entrevistas, conversaciones y apariciones en medios de Daizan Soriano sobre meditacion zen y budismo Soto Zen."
permalink: /entrevistas/
image: /assets/daizan.jpg
---

<section class="archive">
  <header class="section-heading">
    <p class="post-meta">Archivo tematico</p>
    <h1 class="post-title">Entrevistas</h1>
    <p class="post-subtitle">Conversaciones, entrevistas y apariciones en medios recuperadas en el sitio actual.</p>
  </header>

  <article>
    <p class="post-meta">Archivo recuperado · Entrevista</p>
    <h2><a href="{{ '/entrevistas/entrevista-samuel-soriano-instructor-meditacion-zen/' | relative_url }}">Entrevista a Samuel Soriano, instructor de meditacion zen</a></h2>
    <p>Entrevista recuperada desde sotozen.es sobre la practica zen en Alicante, el recorrido de Daizan Soriano y su experiencia en la Via.</p>
  </article>

  {% assign interview_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% assign rendered_interviews = 0 %}
  {% for item in interview_items %}
    {% if item.tags contains 'entrevista' or item.tags contains 'entrevistas' %}
      {% assign rendered_interviews = rendered_interviews | plus: 1 %}
      {% capture content_type %}{% include content-item-type.html post=item %}{% endcapture %}
      {% assign content_type = content_type | strip %}
      {% capture content_label %}{% include content-item-label.html type=content_type %}{% endcapture %}
      {% assign content_label = content_label | strip %}
      <article>
        <p class="post-meta">{{ item.date | date: "%d %b %Y" }} · {{ content_label }}</p>
        <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
        <p>{{ item.description | default: item.excerpt | strip_html | strip_newlines | truncate: 220 }}</p>
      </article>
    {% endif %}
  {% endfor %}

  {% if rendered_interviews == 0 %}
    <article>
      <p>Todavia no hay entrevistas publicadas en este archivo.</p>
    </article>
  {% endif %}

  <section class="post">
    <header class="section-heading">
      <p class="post-meta">Pendientes de recuperar</p>
      <h2 class="post-title">Archivo antiguo</h2>
      <p class="post-subtitle">Estas entrevistas aparecen en la categoria antigua y estan pendientes de recuperacion completa.</p>
    </header>

    <article class="post-card">
      <p class="post-meta">27 May 2021 · Entrevista</p>
      <h3>Encuentro en Silenciarte21</h3>
      <p>Con motivo de una visita a Las Palmas de Gran Canaria para un retiro de introduccion al zen, se compartio un encuentro con Pedro, creador de Silenciarte21.</p>
    </article>

    <article class="post-card">
      <p class="post-meta">14 Aug 2015 · Entrevista</p>
      <h3>Entrevista en conconciencia.com</h3>
      <p>Entrevista realizada por Inaki Calvo para conconciencia.com, mencionada en el archivo antiguo y pendiente de recuperacion integra.</p>
    </article>
  </section>
</section>
