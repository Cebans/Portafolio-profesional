(() => {
  const root = new URL('../../', document.currentScript.src);
  const photos = Array.isArray(window.portfolioPhotos) ? window.portfolioPhotos : [];
  const imageURL = src => new URL(src.split('/').map(encodeURIComponent).join('/'), root).href;
  const groups = new Map();
  photos.forEach(photo => { if (!groups.has(photo.category)) groups.set(photo.category, []); groups.get(photo.category).push(photo); });
  const preferred = ['Perú', 'Naturaleza', 'Retratos', 'Producto', 'Eventos', 'Arquitectura', 'Urbana'];
  const categories = [...preferred.filter(category => groups.has(category)), ...[...groups.keys()].filter(category => !preferred.includes(category))];
  const albumLink = category => { const url = new URL('pages/photography.html', root); url.searchParams.set('album', category); url.hash = 'fotos'; return url; };
  function image(photo) {
    const img = document.createElement('img'); img.src = imageURL(photo.thumb || photo.src); img.alt = photo.title; img.loading = 'lazy'; img.decoding = 'async';
    if (photo.width && photo.height) { img.width = photo.width; img.height = photo.height; } return img;
  }
  const collage = document.querySelector('[data-photo-collage]');
  if (collage && photos.length) {
    collage.replaceChildren();
    categories.forEach((category, index) => {
      const group = groups.get(category), link = document.createElement('a');
      link.className = 'gallery-item' + (index === 0 ? ' large' : index === categories.length - 1 ? ' wide' : '');
      link.href = albumLink(category).href; link.setAttribute('aria-label', 'Ver álbum ' + category + ' · ' + group.length + ' fotografías'); link.append(image(group[0]));
      const caption = document.createElement('span'); caption.textContent = category;
      const count = document.createElement('small'); count.textContent = group.length + ' fotografías'; caption.append(count); link.append(caption); collage.append(link);
    });
  }
  const gallery = document.querySelector('[data-photo-album]');
  if (!gallery) return;
  const filters = document.querySelector('[data-photo-filters]'), collections = document.querySelector('[data-photo-collections]');
  const status = document.querySelector('[data-photo-status]'), heading = document.querySelector('[data-photo-heading]');
  const empty = document.querySelector('[data-photo-empty]'), dialog = document.querySelector('[data-photo-dialog]');
  const full = dialog.querySelector('img'), caption = dialog.querySelector('[data-photo-caption]');
  const previous = dialog.querySelector('[data-photo-previous]'), next = dialog.querySelector('[data-photo-next]');
  const filterButtons = new Map(), collectionLinks = new Map();
  let visible = [], current = 0;
  const selectedFromURL = () => { const value = new URL(location.href).searchParams.get('album') || ''; return groups.has(value) ? value : ''; };
  function show(index) {
    if (!visible.length) return;
    current = (index + visible.length) % visible.length;
    const photo = visible[current]; full.src = imageURL(photo.src); full.alt = photo.title;
    caption.textContent = photo.title + ' · ' + photo.category + ' (' + (current + 1) + '/' + visible.length + ')';
    previous.disabled = next.disabled = visible.length < 2;
  }
  function select(category, persist = true) {
    if (category && !groups.has(category)) category = '';
    visible = category ? groups.get(category) : photos;
    gallery.replaceChildren();
    visible.forEach((photo, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'album-photo';
      button.setAttribute('aria-label', 'Ampliar: ' + photo.title); button.append(image(photo));
      const title = document.createElement('span'); title.textContent = photo.title; button.append(title);
      button.addEventListener('click', () => { show(index); dialog.showModal(); }); gallery.append(button);
    });
    filterButtons.forEach((button, value) => button.setAttribute('aria-pressed', String(value === category)));
    collectionLinks.forEach((link, value) => { if (value === category) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
    if (heading) heading.textContent = category || 'Todas las fotografías';
    empty.hidden = visible.length > 0;
    status.textContent = visible.length + (visible.length === 1 ? ' fotografía' : ' fotografías') + (category ? ' · ' + category : ' · ' + categories.length + ' álbumes');
    if (persist) { const url = new URL(location.href); if (category) url.searchParams.set('album', category); else url.searchParams.delete('album'); if (url.href !== location.href) history.pushState(null, '', url); }
  }
  ['', ...categories].forEach(category => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = category || 'Todas';
    button.setAttribute('aria-pressed', 'false'); button.addEventListener('click', () => select(category)); filters.append(button); filterButtons.set(category, button);
  });
  if (collections) categories.forEach(category => {
    const group = groups.get(category), link = document.createElement('a'); link.className = 'album-collection'; link.href = albumLink(category).href;
    link.setAttribute('aria-label', 'Explorar álbum ' + category + ' · ' + group.length + ' fotografías'); link.append(image(group[0]));
    const content = document.createElement('div'), title = document.createElement('h3'), count = document.createElement('p');
    title.textContent = category; count.textContent = group.length + ' fotografías →'; content.append(title, count); link.append(content);
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); select(category); heading?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }); collections.append(link); collectionLinks.set(category, link);
  });
  window.addEventListener('popstate', () => select(selectedFromURL(), false));
  dialog.querySelector('[data-photo-close]').addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => show(current - 1)); next.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
  dialog.addEventListener('close', () => full.removeAttribute('src'));
  select(selectedFromURL(), false);
})();
