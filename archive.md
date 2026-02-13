---
layout: default
title: "Archivo"
permalink: /archive/
---

<section class="archive">
  <div class="content-filter" data-content-filter>
    <button type="button" class="pill is-filled" data-filter="all">Todos</button>
    <button type="button" class="pill" data-filter="audio">Solo Audio</button>
    <button type="button" class="pill" data-filter="article">Solo Artículos</button>
  </div>
  {% assign all_items = site.podcast | concat: site.posts | sort: "date" | reverse %}
  {% for post in all_items %}
    {% assign has_audio = false %}
    {% if post.audio_url %}
      {% assign has_audio = true %}
    {% else %}
      {% if post.collection == "posts" %}
        {% assign item_audio_rel = post.path | remove_first: "_posts/" | replace: ".markdown", ".mp3" | replace: ".md", ".mp3" %}
      {% else %}
        {% assign item_audio_rel = post.path | remove_first: "_podcast/" | replace: ".markdown", ".mp3" | replace: ".md", ".mp3" %}
      {% endif %}
      {% assign item_audio_path = "/audio/" | append: item_audio_rel %}
      {% for static_file in site.static_files %}
        {% if static_file.path == item_audio_path %}
          {% assign has_audio = true %}
          {% break %}
        {% endif %}
      {% endfor %}
    {% endif %}
    <article data-content-item data-content-type="{% if has_audio %}audio{% else %}article{% endif %}">
      <p class="post-meta">{{ post.date | date: "%d %b %Y" }} · {% if has_audio %}Audio{% else %}Artículo{% endif %}</p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    </article>
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
