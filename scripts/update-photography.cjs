const fs = require('fs');
const path = require('path');
const labels = { naturaleza: 'Naturaleza', retratos: 'Retratos', producto: 'Producto', eventos: 'Eventos', arquitectura: 'Arquitectura', urbana: 'Urbana', coleccion: 'Colección', peru: 'Perú' };
function collect(folder) {
  const photos = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name, 'es'))) {
      const absolute = path.join(dir, item.name);
      if (item.isDirectory()) walk(absolute);
      else if (/\.(jpe?g|png|webp|avif)$/i.test(item.name)) {
        const relative = path.relative(folder, absolute).split(path.sep).join('/');
        const group = relative.includes('/') ? relative.split('/')[0] : 'general';
        const title = path.parse(item.name).name.replace(/[-_]+/g, ' ').trim();
        photos.push({ src: 'assets/images/photography/' + relative, title, category: labels[group] || (group === 'general' ? 'Fotografía' : group) });
      }
    }
  }
  walk(folder);
  return photos;
}
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const metadataPath = path.join(root, 'assets/images/photography/catalogo.json');
  const metadata = fs.existsSync(metadataPath) ? JSON.parse(fs.readFileSync(metadataPath, 'utf8')) : {};
  const photos = collect(path.join(root, 'assets/images/photography')).map(photo => ({ ...photo, ...(metadata[photo.src] || {}) }));
  fs.writeFileSync(path.join(root, 'js/pages/photography-data.js'), 'window.portfolioPhotos = ' + JSON.stringify(photos, null, 2) + ';\n');
  console.log('Álbum actualizado: ' + photos.length + ' fotografías.');
}
module.exports = { collect };
