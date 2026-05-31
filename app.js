const searchInput = document.getElementById('search');
const cards = Array.from(document.querySelectorAll('.noz-card'));
const noResults = document.getElementById('no-results');

// Cache original HTML once so we can always restore cleanly
const originalHTML = new Map(cards.map(c => [c, c.innerHTML]));

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();

  // Always restore originals first so hidden cards have full textContent
  cards.forEach(c => {
    c.classList.remove('hidden');
    c.innerHTML = originalHTML.get(c);
  });

  if (!q) {
    noResults.style.display = 'none';
    return;
  }

  let visible = 0;
  cards.forEach(c => {
    const tags = (c.dataset.tags || '').toLowerCase();
    // Use textContent (works regardless of visibility)
    const text = c.textContent.toLowerCase();
    if (tags.includes(q) || text.includes(q)) {
      highlightText(c, q);
      visible++;
    } else {
      c.classList.add('hidden');
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
});

function highlightText(el, q) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const val = node.nodeValue;
    const idx = val.toLowerCase().indexOf(q);
    if (idx === -1) return;
    const frag = document.createDocumentFragment();
    frag.append(
      document.createTextNode(val.slice(0, idx)),
      Object.assign(document.createElement('mark'), { textContent: val.slice(idx, idx + q.length) }),
      document.createTextNode(val.slice(idx + q.length))
    );
    node.parentNode.replaceChild(frag, node);
  });
}

// Smooth scroll for TOC links
document.querySelectorAll('.toc a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
