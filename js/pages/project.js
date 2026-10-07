(() => {
  const links = Array.from(document.querySelectorAll('[data-project-image]'));
  if (!links.length) return;
  const dialog = document.createElement('dialog'); dialog.className = 'project-lightbox'; dialog.setAttribute('aria-label', 'Imagen del proyecto ampliada');
  dialog.innerHTML = '<button type="button" data-close autofocus>Cerrar ×</button><img alt=""><div class="project-lightbox-controls"><button type="button" data-prev aria-label="Imagen anterior">← Anterior</button><p aria-live="polite"></p><button type="button" data-next aria-label="Imagen siguiente">Siguiente →</button></div>';
  document.body.append(dialog);
  const image = dialog.querySelector('img'), caption = dialog.querySelector('p'); let index = 0;
  function show(n) { index = (n + links.length) % links.length; image.src = links[index].href; image.alt = links[index].querySelector('img').alt; caption.textContent = image.alt + ' (' + (index + 1) + '/' + links.length + ')'; }
  links.forEach((link,i) => link.addEventListener('click', event => { if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); show(i); dialog.showModal(); }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-prev]').disabled = dialog.querySelector('[data-next]').disabled = links.length < 2;
  dialog.addEventListener('click', event => { if(event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => { if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(index + (event.key === 'ArrowLeft' ? -1 : 1)); } });
  dialog.addEventListener('close', () => image.removeAttribute('src'));
})();
