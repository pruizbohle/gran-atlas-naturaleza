/* El Gran Atlas 3.3 — respaldos JSON con exportación e importación Android nativa. */
(() => {
  'use strict';
  const STORAGE_KEY = 'gran_atlas_v05';
  const EMERGENCY_KEY = 'gran_atlas_backup_pre_import_v301';
  const FORMAT = 'el-gran-atlas-save';
  const FORMAT_VERSION = 1;
  const MAX_BYTES = 4 * 1024 * 1024;
  const root = document.getElementById('saveManager');
  const open = document.getElementById('saveManagerOpen');
  const close = document.getElementById('saveManagerClose');
  const backdrop = document.getElementById('saveManagerBackdrop');
  const exportButton = document.getElementById('saveExportBtn');
  const downloadButton = document.getElementById('saveDownloadBtn');
  const importButton = document.getElementById('saveImportBtn');
  const fileInput = document.getElementById('saveImportFile');
  const nativeImportButton = document.getElementById('saveNativeImportBtn');
  const summary = document.getElementById('saveImportSummary');
  const status = document.getElementById('saveManagerStatus');
  if (!root || !open || !exportButton || !fileInput || !importButton) return;
  let pending = null;

  function message(text, isError = false) {
    status.textContent = text;
    status.classList.toggle('error', !!isError);
  }
  function show() {
    root.hidden = false;
    document.body.classList.add('save-manager-open');
    open.setAttribute('aria-expanded', 'true');
    close.focus();
  }
  function hide() {
    root.hidden = true;
    document.body.classList.remove('save-manager-open');
    open.setAttribute('aria-expanded', 'false');
    open.focus();
  }
  open.addEventListener('click', show);
  close.addEventListener('click', hide);
  backdrop.addEventListener('click', hide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !root.hidden) hide();
  });

  function plainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }
  function validNumber(n) {
    return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1e15;
  }
  function validateGame(data) {
    if (!plainObject(data)) throw new Error('El archivo no contiene una partida válida.');
    if (!validNumber(data.money) || !validNumber(data.knowledge) || !validNumber(data.prestige))
      throw new Error('La partida tiene recursos inválidos.');
    if (typeof data.currentRegion !== 'string' || !/^[a-zA-Z0-9_-]{2,64}$/.test(data.currentRegion))
      throw new Error('La región guardada no es válida.');
    for (const field of ['discovered','sightings','stages','upgrades','purchases','regionUnlocked','published']) {
      if (!plainObject(data[field])) throw new Error('Falta un dato necesario: ' + field + '.');
    }
    if (data.inventory !== undefined && !plainObject(data.inventory)) throw new Error('El inventario no es válido.');
    if (data.sexSeen !== undefined && !plainObject(data.sexSeen)) throw new Error('El dimorfismo no es válido.');
    if (data.voyages !== undefined && (!Array.isArray(data.voyages) || data.voyages.length > 100))
      throw new Error('Los viajes guardados no son válidos.');
    const all = [...Object.values(data.sightings), ...Object.values(data.stages), ...Object.values(data.inventory || {})];
    if (all.length > 30000 || !all.every(validNumber)) throw new Error('Los registros de especies tienen valores incorrectos.');
    if (Object.keys(data).some(k => ['__proto__','constructor','prototype'].includes(k)))
      throw new Error('El archivo contiene campos no permitidos.');
    return data;
  }
  function parseBackup(text) {
    if (new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('El archivo supera 4 MB.');
    let parsed;
    try { parsed = JSON.parse(text); } catch (_) { throw new Error('El archivo no contiene JSON válido.'); }
    let data = parsed;
    if (plainObject(parsed) && parsed.format === FORMAT) {
      if (parsed.formatVersion > FORMAT_VERSION || parsed.formatVersion < 1)
        throw new Error('Esta copia utiliza una versión de respaldo no compatible.');
      data = parsed.game;
    }
    return validateGame(data);
  }
  function fileName() {
    return 'el-gran-atlas-partida-' + new Date().toISOString().slice(0, 10) + '.json';
  }
  async function nativeShare(text, name) {
    const capacitor = window.Capacitor;
    const fs = capacitor?.Plugins?.Filesystem;
    const share = capacitor?.Plugins?.Share;
    if (capacitor?.getPlatform?.() !== 'android' || !fs || !share) return false;
    const out = await fs.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
    await share.share({ title: 'Partida de El Gran Atlas', text: 'Copia de seguridad del juego', url: out.uri, dialogTitle: 'Guardar o compartir respaldo' });
    return true;
  }
  function prepareBackup() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('No hay una partida guardada todavía.');
    const data = validateGame(JSON.parse(raw));
    return { text: JSON.stringify({
      format: FORMAT, formatVersion: FORMAT_VERSION, gameVersion: '3.3.0',
      exportedAt: new Date().toISOString(), game: data
    }, null, 2), name: fileName() };
  }

  function browserDownload(text, name) {
    const url = URL.createObjectURL(new Blob([text], {type:'application/json;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function downloadToDevice() {
    try {
      const { text, name } = prepareBackup();
      downloadButton.disabled = true;
      const cap = window.Capacitor;
      const isAndroid = cap?.getPlatform?.() === 'android';
      if (isAndroid) {
        const saver = cap?.Plugins?.AtlasExport ||
          (typeof cap?.registerPlugin === 'function' ? cap.registerPlugin('AtlasExport') : null);
        if (!saver?.saveFile) throw new Error('Esta APK no incluye el guardado nativo. Utiliza Compartir respaldo.');
        await saver.saveFile({name,content:text});
        message('Respaldo guardado en la carpeta que elegiste. Conserva el archivo para recuperar tu partida.');
      } else {
        browserDownload(text, name);
        message('Descarga solicitada: ' + name + '. Comprueba que esté en la carpeta Descargas.');
      }
    } catch (error) {
      if (error?.code === 'CANCELLED') {
        message('Cancelaste el guardado. Tu partida no cambió.');
      } else {
        message('No se pudo guardar el archivo: ' + (error?.message || error), true);
      }
    } finally {
      downloadButton.disabled = false;
    }
  }
  downloadButton?.addEventListener('click', downloadToDevice);

  async function exportSave() {
    try {
      const { text, name } = prepareBackup();
      exportButton.disabled = true;
      if (await nativeShare(text, name)) {
        message('Se abrió el menú de compartir de Android. Selecciona dónde guardar el archivo JSON (por ejemplo, Archivos o Drive).');
      } else {
        browserDownload(text, name);
        message('Se solicitó la descarga del respaldo ' + name + '. Comprueba que esté guardado en tu dispositivo.');
      }
    } catch (error) {
      message('No se pudo exportar: ' + (error?.message || error), true);
    } finally {
      exportButton.disabled = false;
    }
  }
  exportButton.addEventListener('click', exportSave);
  function prepareImport(text, name) {
    pending = null;
    importButton.disabled = true;
    summary.textContent = 'Comprobando archivo…';
    try {
      const data = parseBackup(text.replace(/^\uFEFF/, ''));
      pending = data;
      const observations = Object.values(data.sightings).reduce((sum,n)=>sum+n,0);
      summary.textContent = 'Partida válida: ' + Math.floor(data.prestige) + ' prestigio · £' + Math.floor(data.money)
        + ' · ' + Math.floor(observations) + ' avistamientos. Archivo: ' + name;
      importButton.disabled = false;
      message('Archivo validado. Presiona «Restaurar partida seleccionada» para confirmar.');
    } catch (error) {
      summary.textContent = 'No se pudo cargar el respaldo: ' + (error?.message || error);
      message('Se conservó tu partida actual. No se ha importado nada.', true);
    }
  }
  async function readBrowserFile(file) {
    if (typeof file.text === 'function') return file.text();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Error de lectura'));
      reader.readAsText(file);
    });
  }
  fileInput.addEventListener('change', async () => {
    pending = null;
    importButton.disabled = true;
    const file = fileInput.files?.[0];
    if (!file) { summary.textContent = 'Aún no seleccionaste un archivo.'; return; }
    if (file.size > MAX_BYTES) {
      summary.textContent = 'El archivo supera los 4 MB permitidos.';
      message('No se modificó tu partida.', true);
      return;
    }
    try {
      prepareImport(await readBrowserFile(file), file.name);
    } catch (error) {
      message('No fue posible abrir el archivo: ' + (error?.message || error), true);
    } finally {
      fileInput.value = '';
    }
  });
  nativeImportButton?.addEventListener('click', async () => {
    const cap=window.Capacitor;
    if (cap?.getPlatform?.() !== 'android') {
      fileInput.click(); return;
    }
    const reader=cap?.Plugins?.AtlasImport ||
      (typeof cap?.registerPlugin === 'function' ? cap.registerPlugin('AtlasImport') : null);
    if (!reader?.openFile) {
      message('No se encontró el importador nativo. Prueba seleccionar el JSON con el botón inferior.', true);
      return;
    }
    nativeImportButton.disabled = true;
    try {
      const selected=await reader.openFile();
      prepareImport(selected.content, selected.name || 'Respaldo de Android');
    } catch (error) {
      if (error?.code === 'CANCELLED') message('No se eligió ningún archivo. La partida sigue intacta.');
      else message('No se pudo leer el respaldo: ' + (error?.message || error), true);
    } finally {
      nativeImportButton.disabled = false;
    }
  });
  importButton.addEventListener('click', () => {
    if (!pending) return;
    if (!window.confirm('¿Reemplazar la partida actual por la del archivo? Se guardará una copia de emergencia de la partida anterior en este dispositivo.')) return;
    try {
      const old = localStorage.getItem(STORAGE_KEY);
      if (old) localStorage.setItem(EMERGENCY_KEY, old);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      message('Partida recuperada. Reiniciando el juego…');
      window.location.reload();
    } catch (error) {
      message('No se pudo importar. El almacenamiento podría estar lleno: ' + (error?.message || error), true);
    }
  });
})();
