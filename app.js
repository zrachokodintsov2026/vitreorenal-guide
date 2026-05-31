const searchInput = document.getElementById('search');
const cards = document.querySelectorAll('.noz-card');
const noResults = document.getElementById('no-results');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();

  if (!q) {
    cards.forEach(c => {
      c.classList.remove('hidden');
      restoreText(c);
    });
    noResults.style.display = 'none';
    return;
  }

  let visible = 0;
  cards.forEach(c => {
    const tags = c.dataset.tags || '';
    const text = c.innerText.toLowerCase();
    if (tags.includes(q) || text.includes(q)) {
      c.classList.remove('hidden');
      highlightText(c, q);
      visible++;
    } else {
      c.classList.add('hidden');
      restoreText(c);
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
});

function highlightText(el, q) {
  restoreText(el);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const idx = node.nodeValue.toLowerCase().indexOf(q);
    if (idx === -1) return;
    const span = document.createElement('span');
    const before = document.createTextNode(node.nodeValue.slice(0, idx));
    const mark = document.createElement('mark');
    mark.textContent = node.nodeValue.slice(idx, idx + q.length);
    const after = document.createTextNode(node.nodeValue.slice(idx + q.length));
    span.append(before, mark, after);
    node.parentNode.replaceChild(span, node);
  });
}

function restoreText(el) {
  el.querySelectorAll('mark').forEach(m => {
    m.parentNode.replaceWith(m.parentNode.textContent);
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
