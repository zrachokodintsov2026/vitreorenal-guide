var searchInput = document.getElementById('search');
var noResults = document.getElementById('no-results');
var cards = Array.from(document.querySelectorAll('.noz-card'));

// Build a plain-text index once, so we never touch card contents during search
var index = cards.map(function (card) {
  return {
    el: card,
    text: ((card.dataset.tags || '') + ' ' + card.textContent).toLowerCase()
  };
});

function runSearch() {
  var q = searchInput.value.trim().toLowerCase();
  var visible = 0;

  index.forEach(function (item) {
    if (!q || item.text.indexOf(q) !== -1) {
      item.el.style.display = '';
      visible++;
    } else {
      item.el.style.display = 'none';
    }
  });

  noResults.style.display = (q && visible === 0) ? 'block' : 'none';
}

searchInput.addEventListener('input', runSearch);
searchInput.addEventListener('keyup', runSearch);

// Smooth scroll for TOC links
document.querySelectorAll('.toc a').forEach(function (a) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
