---
layout: default
title: "Meditacion zen y budismo Soto Zen"
description: "Reflexiones, ensenanzas y recursos de meditacion zen y budismo Soto Zen de Daizan Soriano."
permalink: /
---

{% assign blog_items = site.posts | sort: "date" | reverse %}
{% assign featured_post = blog_items | first %}

{% if featured_post %}
{% assign featured_post_image = featured_post.image | default: '/assets/daizan.jpg' %}
{% if featured_post_image == '/assets/logo.png' %}
{% assign featured_post_image = '/assets/daizan.jpg' %}
{% endif %}
{% if featured_post_image contains '://' %}
{% assign featured_post_image_url = featured_post_image %}
{% else %}
{% assign featured_post_image_url = featured_post_image | relative_url %}
{% endif %}

<section class="section-heading">
  <p class="post-meta">Budismo Soto Zen</p>
  <h1 class="post-title">Meditacion zen y budismo Soto Zen</h1>
  <p class="post-subtitle">Textos, audios y recursos de practica de Daizan Soriano para integrar el Dharma en la vida cotidiana.</p>
</section>

<section class="home-featured-post">
  <div class="home-featured-post__media">
    <a href="{{ featured_post.url | relative_url }}" aria-label="Ir a la entrada {{ featured_post.title }}">
      {% if featured_post_image == '/assets/daizan.jpg' %}
      <img
        src="{{ '/assets/daizan-264.webp' | relative_url }}"
        srcset="{{ '/assets/daizan-132.webp' | relative_url }} 132w, {{ '/assets/daizan-264.webp' | relative_url }} 264w"
        sizes="132px"
        alt="Imagen de la entrada {{ featured_post.title }}"
        width="132"
        height="132"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      >
      {% else %}
      <img src="{{ featured_post_image_url }}" alt="Imagen de la entrada {{ featured_post.title }}" width="132" height="132" loading="eager" fetchpriority="high" decoding="async">
      {% endif %}
    </a>
  </div>
  <div class="home-featured-post__content">
    <p class="home-featured-post__kicker">Última entrada</p>
    <h2>{{ featured_post.title }}</h2>
    <p class="post-meta">
      {{ featured_post.date | date: "%d %b %Y" }}
      {% if featured_post.categories %} · {{ featured_post.categories | join: ", " }}{% endif %}
    </p>
    <p class="home-featured-post__summary">
      {% if featured_post.description %}
        {{ featured_post.description | strip_html | strip_newlines | truncate: 180 }}
      {% else %}
        {{ featured_post.excerpt | strip_html | strip_newlines | truncate: 180 }}
      {% endif %}
    </p>
    <div class="home-featured-post__actions">
      <a class="pill is-filled" href="{{ featured_post.url | relative_url }}">Leer entrada</a>
    </div>
  </div>
</section>
{% endif %}

<section class="post-list">
  <div class="post-grid">
    {% for post in blog_items offset:1 %}
      <article class="post-card">
        <p class="post-meta">{{ post.date | date: "%d %b %Y" }}{% if post.categories %} · {{ post.categories | join: ", " }}{% endif %}</p>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        {% assign post_summary = post.description | default: post.excerpt | strip_html | strip_newlines %}
        {% if post_summary == "" %}
          {% assign post_summary = post.content | strip_html | strip_newlines %}
        {% endif %}
        <p>{{ post_summary | truncate: 180 }}</p>
      </article>
    {% endfor %}
  </div>
</section>

{% include newsletter-cta.html
  title="Recibe cada nueva enseñanza por correo"
  text="Sin ruido, sin spam. Solo nuevas publicaciones y audios."
  button_label="Quiero recibirlas"
%}
