'use strict';

importScripts('./offline-files.js');

const prefix = 'atlas-zoological-lab-';
const { files, revision } = self.AtlasZoologicalOffline;
const cacheName = prefix + revision;
const urls = files.map(file => new URL(file, self.registration.scope).href);
const assets = new Set(urls);

async function prepare() {
  const cache = await caches.open(cacheName);
  try {
    for (let index = 0; index < urls.length; index += 12) {
      await cache.addAll(urls.slice(index, index + 12).map(url => new Request(url, { cache: 'reload', redirect: 'error' })));
    }
  } catch (error) {
    await caches.delete(cacheName);
    throw error;
  }
  await self.skipWaiting();
}

self.addEventListener('install', event => event.waitUntil(prepare()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const previous = (await caches.keys()).filter(key => key.startsWith(prefix) && key !== cacheName);
  await Promise.all(previous.map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  url.hash = '';
  if (!assets.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(url.href) || fetch(event.request);
  })());
});
