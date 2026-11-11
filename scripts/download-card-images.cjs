// Download Japanese card scans into this repository, without external dependencies.
// Run: node scripts/download-card-images.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
const context = vm.createContext({});
const sets = vm.runInContext(source + '\n;SETS', context);
const jobs = new Map();
for (const set of Object.values(sets)) {
  if (!set.cdnSet || !Array.isArray(set.cards)) continue;
  for (const card of set.cards) {
    if (card.img === undefined || card.img === null || card.img === '') continue;
    const key = set.cdnSet + '/' + card.img;
    jobs.set(key, {
      url: 'https://pokecardex-scans.b-cdn.net/sets_jp/' + key + '.jpg?class=md',
      dest: path.join(__dirname, '../images/cards', key + '.jpg')
    });
  }
}
async function download(job) {
  if (fs.existsSync(job.dest) && fs.statSync(job.dest).size > 1000) return 'existing';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(job.url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const bytes = Buffer.from(await response.arrayBuffer());
      const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
      const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
      const webp = bytes.toString('ascii', 0, 4) === 'RIFF' &&
        bytes.toString('ascii', 8, 12) === 'WEBP';
      if (bytes.length < 1000 || !(jpeg || png || webp))
        throw new Error('Unsupported image response (' + (response.headers.get('content-type') || 'unknown') + ', first bytes: ' + bytes.subarray(0, 12).toString('hex') + ')');
      fs.mkdirSync(path.dirname(job.dest), { recursive: true });
      fs.writeFileSync(job.dest, bytes);
      return 'downloaded';
    } catch (error) {
      if (attempt === 2) { console.error(job.url, String(error)); return 'failed'; }
      await new Promise(resolve => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }
}
(async () => {
  const queue = [...jobs.values()];
  let next = 0, ok = 0, failed = 0;
  async function worker() {
    while (next < queue.length) {
      const result = await download(queue[next++]);
      if (result === 'failed') failed++;
      else ok++;
    }
  }
  await Promise.all(Array.from({length: 6}, worker));
  console.log('Card scans: ' + ok + ' available, ' + failed + ' failed, ' + queue.length + ' unique images');
  if (failed) process.exitCode = 1;
})();
