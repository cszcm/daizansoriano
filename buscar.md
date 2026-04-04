---
layout: default
title: "Buscar"
description: "Buscador interno de articulos, podcast y paginas del sitio de Daizan Soriano."
permalink: /buscar/
search_exclude: true
---

<section class="section-heading">
  <p class="post-meta">Buscar</p>
  <h1 class="post-title">Buscador interno</h1>
  <p class="post-subtitle">Encuentra articulos, audios y paginas del sitio por tema, concepto o titulo.</p>
</section>

<section class="search-page" data-search-page>
  <form class="search-page-form" action="{{ '/buscar/' | relative_url }}" method="get" role="search">
    <label class="search-label" for="search-page-input">Buscar en el sitio</label>
    <div class="search-form-row">
      <input
        class="search-input"
        id="search-page-input"
        name="q"
        type="search"
        inputmode="search"
        autocomplete="off"
        spellcheck="false"
        placeholder="Ejemplo: trauma, zazen, xin xin ming, entrevista"
        data-search-input
      />
      <button class="pill is-filled" type="submit">Buscar</button>
    </div>
  </form>

  <p class="search-status" data-search-status>Escribe algo para empezar a buscar.</p>

  <div class="post-grid search-results" data-search-results hidden></div>
</section>

<script>
  (function () {
    var page = document.querySelector('[data-search-page]');
    if (!page) return;

    var input = page.querySelector('[data-search-input]');
    var status = page.querySelector('[data-search-status]');
    var results = page.querySelector('[data-search-results]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = (params.get('q') || '').trim();
    var searchIndex = null;

    function normalizeText(value) {
      return (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    }

    function escapeHtml(value) {
      return (value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    function formatTypeLabel(type) {
      if (type === 'podcast') return 'Podcast';
      if (type === 'pagina') return 'Pagina';
      return 'Articulo';
    }

    function formatDate(dateValue) {
      if (!dateValue) return '';
      var parsed = new Date(dateValue + 'T00:00:00');
      if (Number.isNaN(parsed.getTime())) return '';
      return parsed.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function buildSnippet(item, terms) {
      var source = item.description || item.content || '';
      if (!source) return '';
      var lowered = normalizeText(source);
      var index = -1;

      terms.forEach(function (term) {
        var termIndex = lowered.indexOf(term);
        if (termIndex !== -1 && (index === -1 || termIndex < index)) index = termIndex;
      });

      if (index === -1) return source.slice(0, 220).trim();
      var start = Math.max(0, index - 80);
      var end = Math.min(source.length, index + 180);
      var snippet = source.slice(start, end).trim();
      if (start > 0) snippet = '…' + snippet;
      if (end < source.length) snippet = snippet + '…';
      return snippet;
    }

    function scoreItem(item, terms) {
      var title = normalizeText(item.title);
      var description = normalizeText(item.description);
      var content = normalizeText(item.content);
      var score = 0;

      terms.forEach(function (term) {
        if (title.indexOf(term) !== -1) score += 10;
        if (description.indexOf(term) !== -1) score += 6;
        if (content.indexOf(term) !== -1) score += 2;
      });

      return score;
    }

    function renderResults(query, items) {
      var normalizedQuery = normalizeText(query);
      var terms = normalizedQuery.split(/\s+/).filter(Boolean);

      if (!terms.length) {
        results.hidden = true;
        results.innerHTML = '';
        status.textContent = 'Escribe algo para empezar a buscar.';
        return;
      }

      var matches = items
        .map(function (item) {
          return {
            item: item,
            score: scoreItem(item, terms)
          };
        })
        .filter(function (entry) {
          return entry.score > 0;
        })
        .sort(function (left, right) {
          if (right.score !== left.score) return right.score - left.score;
          return String(right.item.date || '').localeCompare(String(left.item.date || ''));
        })
        .slice(0, 24);

      if (!matches.length) {
        results.hidden = true;
        results.innerHTML = '';
        status.textContent = 'No he encontrado resultados para "' + query + '".';
        return;
      }

      status.textContent = matches.length + ' resultado' + (matches.length === 1 ? '' : 's') + ' para "' + query + '".';
      results.hidden = false;
      results.innerHTML = matches.map(function (entry) {
        var item = entry.item;
        var snippet = buildSnippet(item, terms);
        var date = formatDate(item.date);
        var meta = date ? date + ' · ' + formatTypeLabel(item.type) : formatTypeLabel(item.type);

        return (
          '<article class="post-card search-result-card">' +
            '<p class="post-meta">' + escapeHtml(meta) + '</p>' +
            '<h2><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>' +
            (snippet ? '<p>' + escapeHtml(snippet) + '</p>' : '') +
          '</article>'
        );
      }).join('');
    }

    function runSearch(query) {
      if (!searchIndex) return;
      renderResults(query, searchIndex);
    }

    fetch('{{ "/search.json" | relative_url }}')
      .then(function (response) {
        if (!response.ok) throw new Error('search-index-unavailable');
        return response.json();
      })
      .then(function (data) {
        searchIndex = Array.isArray(data) ? data : [];
        if (initialQuery) {
          input.value = initialQuery;
          runSearch(initialQuery);
        }
      })
      .catch(function () {
        status.textContent = 'No he podido cargar el indice de busqueda.';
      });

    input.addEventListener('input', function () {
      runSearch(input.value.trim());
    });
  })();
</script>
