const CACHE_NAME = 'thungplus-v2';
const urlsToCache = [
  '/',
  '/index.html',  // หรือชื่อไฟล์ HTML ของคุณ
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // ← เพิ่มบรรทัดนี้ ให้ activate ทันที
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim()) // ← เพิ่มบรรทัดนี้ ให้ควบคุมหน้าใหม่ทันที
  );
});