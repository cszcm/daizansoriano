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
    <p>Entrevista recuperada desde caminomedio.org sobre la practica zen en Alicante, el recorrido de Daizan Soriano y su experiencia en la Via.</p>
  </article>

  <article>
    <p class="post-meta">Archivo recuperado · Entrevista</p>
    <h2><a href="{{ '/entrevistas/encuentro-en-silenciarte21/' | relative_url }}">Encuentro en Silenciarte21</a></h2>
    <p>Ficha de archivo sobre un encuentro con Pedro, creador de Silenciarte21, previo a un retiro de introduccion al zen en Gran Canaria.</p>
  </article>

  <article>
    <p class="post-meta">Archivo recuperado · Entrevista</p>
    <h2><a href="{{ '/entrevistas/entrevista-en-conconciencia-com/' | relative_url }}">Entrevista en conconciencia.com</a></h2>
    <p>Ficha de archivo sobre la entrevista realizada por Inaki Calvo para conconciencia.com, recuperada desde el archivo antiguo del sitio.</p>
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

</section>
