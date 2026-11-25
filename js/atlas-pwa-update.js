(function (root) {
  'use strict';

  const SAVE = 'gran_atlas_v05_preview_mec09d';
  const BACKUP = 'gran_atlas_backup_before_update_preview_mec09d';
  const CHECK_INTERVAL = 60000;
  const versionPattern = /^\d+\.\d+\.\d+$/;

  function isNewer(available, installed) {
    const next = available.split('.').map(Number);
    const current = installed.split('.').map(Number);
    const difference = next.findIndex((number, index) => number !== current[index]);
    return difference >= 0 && next[difference] > current[difference];
  }

  function backupSave(storage) {
    const raw = storage.getItem(SAVE);
    if (raw !== null) {
      storage.setItem(BACKUP, raw);
      if (storage.getItem(BACKUP) !== raw) throw Error('No se pudo verificar la copia exacta de la partida.');
    }
    return raw;
  }

  let releaseChannel = 'estable';
  const channelLabel = () => releaseChannel === 'beta' ? ' (canal beta)' : '';

  async function fetchVersion(base) {
    const endpoint = new URL('atlas-release.json', base);
    endpoint.searchParams.set('check', Date.now());
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 12000);
    try {
      const response = await fetch(endpoint, { cache: 'no-store', signal: abort.signal });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const { version, channel } = await response.json();
      if (typeof version !== 'string' || !versionPattern.test(version)) throw Error('Versión inválida');
      // MEC-02: el canal (beta o estable) se informa aparte; la versión sigue siendo numérica
      // porque la caché offline y la comparación de versiones dependen de ese formato.
      releaseChannel = channel === 'beta' ? 'beta' : 'estable';
      return version;
    } catch {
      throw Error('No se pudo consultar la versión publicada. Revisa la conexión y vuelve a intentar.');
    } finally {
      clearTimeout(timeout);
    }
  }

  function ask(worker, type, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const finish = (callback, value) => {
        clearTimeout(timer);
        channel.port1.close();
        callback(value);
      };
      const timer = setTimeout(() => finish(reject, Error('La versión no respondió. Vuelve a intentar.')), timeout);
      channel.port1.onmessage = event => finish(resolve, event.data);
      try {
        worker.postMessage({ type }, [channel.port2]);
      } catch (error) {
        finish(reject, error);
      }
    });
  }

  function waitForState(target, eventName, check, timeout, timeoutMessage) {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        target.removeEventListener(eventName, changed);
      };
      const changed = () => {
        try {
          const value = check();
          if (value) {
            cleanup();
            resolve(value);
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(Error(timeoutMessage));
      }, timeout);
      target.addEventListener(eventName, changed);
      changed();
    });
  }

  async function downloadCandidate(serviceWorkers, base, version) {
    const url = new URL('sw.js', base);
    url.searchParams.set('install', version);
    const registration = await serviceWorkers.register(url, { scope: base.href, updateViaCache: 'none' });
    const worker = [registration.installing, registration.waiting, registration.active]
      .find(candidate => candidate?.scriptURL === url.href);
    if (!worker) throw Error('El servidor aún no tiene lista esa versión. Vuelve a intentar.');
    await waitForState(worker, 'statechange', () => {
      if (worker.state === 'redundant') throw Error('Se interrumpió la descarga o falló una comprobación. La versión activa sigue disponible.');
      return ['installed', 'activating', 'activated'].includes(worker.state);
    }, 300000, 'La descarga tardó demasiado. Comprueba la conexión antes de reintentarlo.');
    const status = await ask(worker, 'ATLAS_UPDATE_STATUS');
    if (status.version !== version || !status.ready) throw Error('La versión descargada todavía no está completa.');
    return worker;
  }

  async function currentInstallation(serviceWorkers) {
    const worker = serviceWorkers.controller || (await serviceWorkers.getRegistration())?.active;
    if (!worker) return null;
    try {
      return await ask(worker, 'ATLAS_UPDATE_STATUS', 650);
    } catch {
      // Earlier workers answer only their own update pages. Their live cache includes the release number.
      const versions = (await caches.keys()).flatMap(key => {
        const match = /^gran-atlas-v(\d+\.\d+\.\d+)-naturalist-[a-f\d]+$/.exec(key);
        return match ? [match[1]] : [];
      }).sort((a, b) => a === b ? 0 : isNewer(a, b) ? 1 : -1);
      return { version: versions[0], ready: versions.length > 0 };
    }
  }

  function bootGame(base, serviceWorkers) {
    const installed = document.querySelector('meta[name=atlas-version]').content;
    const manual = document.getElementById('atlasUpdateLaunch');
    const notice = document.getElementById('atlasUpdateNotice');
    const noticeVersions = document.getElementById('atlasUpdateNoticeVersions');
    const manualStatus = document.getElementById('saveManagerStatus');
    const statusLink = document.getElementById('atlasUpdatePageLink');
    let lastCheck = -Infinity;
    let inFlight;
    let dismissed;
    let available;

    async function showCheck(manualCheck = false) {
      if (!manualCheck && Date.now() - lastCheck < CHECK_INTERVAL) return;
      if (manualCheck) manualStatus.textContent = 'Buscando actualizaciones…';
      lastCheck = Date.now();
      inFlight ||= fetchVersion(base).finally(() => { inFlight = null; });
      try {
        available = await inFlight;
        const newer = isNewer(available, installed);
        if (manualCheck) {
          statusLink.hidden = false;
          statusLink.textContent = newer ? 'Abrir el actualizador' : 'Preparar el juego sin conexión';
          manualStatus.textContent = newer ? 'Versión nueva disponible ' + available + '.' : 'Tienes la versión ' + installed + '.';
        }
        noticeVersions.textContent = 'Instalada ' + installed + ' · Disponible ' + available + channelLabel();
        notice.hidden = !newer || (!manualCheck && dismissed === available);
      } catch {
        if (manualCheck) manualStatus.textContent = 'No se pudo comprobar la versión. Revisa la conexión.';
      }
    }

    const open = event => {
      try {
        if (root.AtlasSaveBridge?.persistBeforeUpdate?.() === true) return;
      } catch {
        // Keep the current page open if the game could not save.
      }
      event.preventDefault();
      const message = 'La partida todavía no se pudo guardar. Usa Respaldos antes de actualizar.';
      manualStatus.textContent = message;
      noticeVersions.textContent = message;
    };
    document.getElementById('atlasUpdateNoticeOpen').addEventListener('click', event => {
      open(event);
      if (!event.defaultPrevented) location.assign(new URL('actualizar-atlas.html', base));
    });
    statusLink.addEventListener('click', open);
    manual.addEventListener('click', () => showCheck(true));
    document.getElementById('atlasUpdateLater').addEventListener('click', () => {
      dismissed = available;
      notice.hidden = true;
    });
    root.addEventListener('focus', () => showCheck());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') showCheck();
    });
    root.addEventListener('online', () => showCheck());
    showCheck();

    serviceWorkers.getRegistration(base).then(registration => {
      if (!registration) return serviceWorkers.register(new URL('sw.js', base), { updateViaCache: 'none' });
    }).catch(() => {});
  }

  async function bootUpdater(base, serviceWorkers) {
    const display = id => document.getElementById(id);
    const installedLabel = display('atlasUpdateInstalled');
    const availableLabel = display('atlasUpdateAvailable');
    const prepare = display('atlasUpdateApply');
    const install = display('atlasUpdateInstall');
    const download = display('backup');
    const progress = display('atlasUpdateProgress');
    const status = display('status');
    const returnLink = display('atlasUpdateReturn');
    const mb = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 });
    let version;
    let release;
    let prepared;
    let exact;
    let downloadURL;

    function announce(message, error = false) {
      status.textContent = message;
      status.dataset.error = String(error);
    }

    function preserve() {
      exact = backupSave(localStorage);
      if (downloadURL) URL.revokeObjectURL(downloadURL);
      if (exact !== null) {
        downloadURL = URL.createObjectURL(new Blob([exact], { type: 'application/json' }));
        download.href = downloadURL;
      }
      download.hidden = exact === null;
    }

    function report(event) {
      const { type, version: candidate, terminal, complete, total, bytes, totalBytes } = event.data || {};
      if (type !== 'ATLAS_UPDATE_PROGRESS' || candidate !== version || !prepare.disabled) return;
      if (event.source?.scriptURL !== new URL('sw.js?install=' + version, base).href) return;
      if (terminal) {
        announce(terminal, true);
        return;
      }
      if (!total) return;
      progress.hidden = false;
      progress.max = total;
      progress.value = complete;
      announce('Descargando y verificando… ' + complete + ' de ' + total + ' archivos · ' +
        mb.format(bytes / 1000000) + ' de ' + mb.format(totalBytes / 1000000) + ' MB.');
    }

    async function inspect() {
      prepare.disabled = true;
      announce('Buscando actualizaciones…');
      try {
        release = await currentInstallation(serviceWorkers);
        installedLabel.textContent = release?.version || 'Sin versión offline detectada';
        version = await fetchVersion(base);
        availableLabel.textContent = version + channelLabel();
        if (release?.version && isNewer(release.version, version)) {
          announce('Este navegador tiene una versión más reciente que la publicada.');
          return;
        }
        if (release?.version === version && release.ready) {
          announce('El juego ya está actualizado y disponible sin conexión.');
          return;
        }
        const update = release?.version && release.version !== version;
        announce(update ? 'Nueva versión disponible. La descarga comienza cuando la autorices.' :
          'Prepara esta versión para jugar sin conexión.');
        prepare.textContent = update ? 'Descargar actualización' : 'Descargar para jugar sin conexión';
      } catch {
        availableLabel.textContent = 'Sin conexión';
        announce('No se pudo consultar la versión publicada. Revisa la conexión y vuelve a intentar.', true);
        version = null;
        prepare.textContent = 'Buscar de nuevo';
      }
      prepare.disabled = false;
    }

    serviceWorkers.addEventListener('message', report);
    prepare.addEventListener('click', async () => {
      if (!version) return inspect();
      prepare.disabled = true;
      progress.hidden = true;
      try {
        const latest = await fetchVersion(base);
        if (latest !== version) {
          await inspect();
          return;
        }
        preserve();
        announce(exact === null ? 'Preparando la descarga sin partida previa…' :
          'Respaldo exacto verificado. Preparando la descarga…');
        prepared = await downloadCandidate(serviceWorkers, base, version);
        progress.hidden = true;
        prepare.hidden = true;
        install.hidden = false;
        announce('Descarga completa e integridad verificada. Puedes descargar la copia y pulsar Instalar.');
      } catch (error) {
        announce(error.message, true);
        progress.hidden = true;
        prepare.disabled = false;
        prepare.textContent = 'Volver a intentar';
      }
    });

    install.addEventListener('click', async () => {
      install.disabled = true;
      try {
        const status = await ask(prepared, 'ATLAS_UPDATE_STATUS');
        if (!status.ready || status.version !== version) throw Error('La descarga ya no está disponible. Vuelve a prepararla.');
        if (status.otherClients) throw Error('Hay otra pestaña o ventana del Atlas abierta. Ciérrala y vuelve a pulsar Instalar.');
        if (localStorage.getItem(SAVE) !== exact || (exact !== null && localStorage.getItem(BACKUP) !== exact)) {
          preserve();
          announce('La partida había cambiado. Se verificó un respaldo nuevo. Pulsa Instalar para continuar.');
          return;
        }
        announce('Instalando la versión ' + version + '…');
        const result = await ask(prepared, 'ATLAS_APPLY_UPDATE');
        if (!result.accepted) throw Error('La activación aún no es segura. Cierra las otras ventanas del Atlas.');
        await waitForState(serviceWorkers, 'controllerchange', () => serviceWorkers.controller === prepared,
          20000, 'Todavía no se pudo confirmar la activación. Mantén esta página abierta y vuelve a intentar.');
        announce('Versión ' + version + ' instalada. El juego está disponible sin conexión.');
        installedLabel.textContent = version;
        returnLink.href = new URL('index.html?actualizado=' + version, base);
        install.hidden = true;
      } catch (error) {
        announce(error.message, true);
        if (prepared?.state === 'redundant') {
          install.hidden = true;
          prepare.hidden = false;
          prepare.disabled = false;
        }
      } finally {
        install.disabled = false;
      }
    });

    await inspect();
  }

  if (typeof module === 'object' && module.exports) module.exports = { isNewer, backupSave };
  if (typeof document === 'undefined') return;
  const base = new URL('./', location.href);
  const native = ['android', 'ios'].includes(root.Capacitor?.getPlatform?.());
  const updater = document.getElementById('atlasUpdatePage');
  if (native || !('serviceWorker' in navigator)) {
    if (updater) document.getElementById('status').textContent = 'Abre esta página en un navegador compatible con la PWA.';
    const manual = document.getElementById('atlasUpdateLaunch');
    if (manual) manual.hidden = true;
  } else if (updater) {
    bootUpdater(base, navigator.serviceWorker);
  } else {
    bootGame(base, navigator.serviceWorker);
  }
})(globalThis);
