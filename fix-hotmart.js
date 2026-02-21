const fs = require('fs');
const p = JSON.parse(fs.readFileSync('products.json', 'utf8'));
let changed = 0;
p.forEach(x => {
  if (x.hotmartLink) {
    const clean = x.hotmartLink.split('?')[0] + '?src=github';
    if (clean !== x.hotmartLink) { changed++; }
    x.hotmartLink = clean;
  }
});
fs.writeFileSync('products.json', JSON.stringify(p, null, 2), 'utf8');
console.log('Total:', p.length, '| Changed:', changed);
console.log('src=Portal:', p.filter(x => x.hotmartLink && x.hotmartLink.includes('src=Portal')).length);
console.log('src=github:', p.filter(x => x.hotmartLink && x.hotmartLink.includes('src=github')).length);
