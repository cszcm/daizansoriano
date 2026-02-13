---
layout: default
title: "Etiquetas"
permalink: /tags/
---

<section class="tags">
  <div class="content-filter" data-content-filter>
    <button type="button" class="pill is-filled" data-filter="all">Todos</button>
    <button type="button" class="pill" data-filter="audio">Solo Audio</button>
    <button type="button" class="pill" data-filter="article">Solo Artículos</button>
  </div>
  {% assign all_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% assign tags_joined = "" %}
  {% for post in all_items %}
    {% for tag in post.tags %}
      {% assign tags_joined = tags_joined | append: tag | append: "||" %}
    {% endfor %}
  {% endfor %}
  {% assign tags = tags_joined | split: "||" | uniq | sort %}
  {% for tag in tags %}
    {% unless tag == "" %}
      <h2 id="{{ tag | slugify }}">{{ tag }}</h2>
      <ul>
      {% for post in all_items %}
        {% if post.tags contains tag %}
          {% assign is_audio_item = post.collection == "podcast" %}
          <li data-content-item data-content-type="{% if is_audio_item %}audio{% else %}article{% endif %}"><a href="{{ post.url | relative_url }}">{{ post.title }}</a> · <span class="post-meta">{% if is_audio_item %}Audio{% else %}Artículo{% endif %}</span></li>
        {% endif %}
      {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
</section>

<script>
  (function () {
    var controls = document.querySelector('[data-content-filter]');
    var items = document.querySelectorAll('[data-content-item]');
    if (!controls || !items.length) return;

    var buttons = controls.querySelectorAll('[data-filter]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('tipo');
    var valid = { all: true, audio: true, article: true };
    var current = valid[initial] ? initial : 'all';

    function applyFilter(filterValue) {
      current = filterValue;
      items.forEach(function (item) {
        var itemType = item.getAttribute('data-content-type');
        item.hidden = current !== 'all' && itemType !== current;
      });
      buttons.forEach(function (button) {
        button.classList.toggle('is-filled', button.getAttribute('data-filter') === current);
      });
      var nextParams = new URLSearchParams(window.location.search);
      if (current === 'all') {
        nextParams.delete('tipo');
      } else {
        nextParams.set('tipo', current);
      }
      var nextQuery = nextParams.toString();
      var nextUrl = window.location.pathname + (nextQuery ? '?' + nextQuery : '') + window.location.hash;
      window.history.replaceState(null, '', nextUrl);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        applyFilter(button.getAttribute('data-filter'));
      });
    });

    applyFilter(current);
  })();
</script>
