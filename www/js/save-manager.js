/* El Gran Atlas 3.4 — recuperación verificada, compatibilidad con JSON y alternativas de importación. */
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
  const pasteInput = document.getElementById('savePasteJson');
  const pasteButton = document.getElementById('savePasteBtn');
  const receiptKey = 'gran_atlas_restore_receipt_v34';
  const preImportKey = 'gran_atlas_backup_pre_import_v301';
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
  function normalizeGame(data) {
    if (!plainObject(data)) throw new Error('El archivo no contiene un objeto de partida.');
    const base=Object.create(null);
    if (!validNumber(data.money) || !validNumber(data.knowledge) || !validNumber(data.prestige))
      throw new Error('Faltan libras, conocimiento o prestigio válidos.');
    if (typeof data.currentRegion !== 'string' || !/^[a-zA-Z0-9_-]{2,64}$/.test(data.currentRegion))
      throw new Error('El código de región guardado no es válido.');
    if (!['discovered','sightings','stages'].some(k=>plainObject(data[k])))
      throw new Error('No hay registros de especies: este JSON no parece una partida de El Gran Atlas.');
    for (const key of ['discovered','sightings','stages','upgrades','purchases','regionUnlocked','published','inventory','sexSeen','specialSeen','specialFound','feedObs','dimorphism','equipment']) {
      if (data[key]!==undefined && !plainObject(data[key]))
        throw new Error('El campo '+key+' tiene un formato incorrecto.');
    }
    if (data.voyages!==undefined && (!Array.isArray(data.voyages)||data.voyages.length>100))
      throw new Error('La lista de expediciones no es válida.');
    for (const key of ['sightings','stages','inventory']) {
      const entries=Object.values(data[key]||{});
      if (entries.length>30000 || entries.some(n=>!validNumber(n)))
        throw new Error('El campo '+key+' tiene cantidades incorrectas.');
    }
    if (Object.keys(data).some(k=>['__proto__','constructor','prototype'].includes(k)))
      throw new Error('El archivo contiene campos no permitidos.');
    Object.assign(base,data);
    for (const key of ['discovered','sightings','stages','upgrades','purchases','regionUnlocked','published','inventory','sexSeen','specialSeen','specialFound','feedObs','dimorphism']) {
      if (!base[key]) base[key]={};
    }
    if (!base.regionUnlocked[base.currentRegion]) base.regionUnlocked[base.currentRegion]=true;
    if (!base.voyages) base.voyages=[];
    if (!base.equipment) base.equipment={instrument:null,hat:null,necklace:null};
    return base;
  }
  function parseBackup(text) {
    if (typeof text !== 'string') throw new Error('No se pudo leer el contenido del documento.');
    if (new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('El archivo supera los 4 MB.');
    let parsed;
    try { parsed = JSON.parse(text.replace(/^\uFEFF/, '')); }
    catch (_) { throw new Error('El documento no es JSON válido. Selecciona el archivo el-gran-atlas-partida-*.json, no el APK.'); }
    let data=parsed;
    if (plainObject(parsed) && parsed.format === FORMAT) {
      if (!Number.isInteger(parsed.formatVersion)||parsed.formatVersion>FORMAT_VERSION||parsed.formatVersion<1)
        throw new Error('Formato de respaldo no compatible.');
      data=parsed.game;
    } else if (plainObject(parsed) && plainObject(parsed.game) && parsed.game.money!==undefined) {
      data=parsed.game;
    } else if (plainObject(parsed) && plainObject(parsed.state) && parsed.state.money!==undefined) {
      data=parsed.state;
    } else if (plainObject(parsed) && typeof parsed[STORAGE_KEY]==='string') {
      try {data=JSON.parse(parsed[STORAGE_KEY]);}
      catch(_){throw new Error('El respaldo antiguo contiene un registro ilegible.');}
    }
    return normalizeGame(data);
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
    const data = normalizeGame(JSON.parse(raw));
    return { text: JSON.stringify({
      format: FORMAT, formatVersion: FORMAT_VERSION, gameVersion: '3.4.0',
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
      const data = parseBackup(text);
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

  function receiptSnapshot(data) {
    return {
      prestige:data.prestige,
      currentRegion:data.currentRegion,
      sightings:Object.values(data.sightings||{}).reduce((sum,n)=>sum+n,0),
      published:Object.values(data.published||{}).filter(Boolean).length
    };
  }
  function compareReceipt(expected,actual) {
    return expected.prestige===actual.prestige &&
      expected.sightings===actual.sightings &&
      expected.published===actual.published &&
      expected.currentRegion===actual.currentRegion;
  }
  function showPreviousRestore() {
    try {
      const prior=JSON.parse(localStorage.getItem(receiptKey)||'null');
      if(!prior) return;
      localStorage.removeItem(receiptKey);
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) throw new Error('No hay una partida guardada después del reinicio.');
      const current=normalizeGame(JSON.parse(raw));
      const actual=receiptSnapshot(current);
      if(compareReceipt(prior,actual)) {
        summary.textContent='✅ Restauración verificada después del reinicio: '+actual.sightings+' avistamientos · '+actual.prestige+' prestigio · región '+actual.currentRegion+'.';
        message('La partida importada está disponible en esta instalación.');
      }else {
        summary.textContent='⚠️ No coincide la partida después del reinicio. Conservamos el respaldo anterior en esta instalación.';
        message('Se detectó una diferencia al reiniciar. No elimines tu partida original ni el JSON.',true);
      }
    } catch(error) {
      message('No se pudo verificar la restauración: '+(error?.message||error),true);
    }
  }
  function restoreSelected() {
    if(!pending) return;
    if(!window.confirm('¿Restaurar la partida elegida en ESTA instalación? La partida original de otra aplicación no se modifica.')) return;
    try{
      const old=localStorage.getItem(STORAGE_KEY);
      const serialized=JSON.stringify(pending);
      if(old) {
        // Guardar una copia anterior y no depender solo de un único respaldo de emergencia.
        localStorage.setItem(EMERGENCY_KEY,old);
      }
      localStorage.setItem(STORAGE_KEY,serialized);
      if(localStorage.getItem(STORAGE_KEY)!==serialized)
        throw new Error('El almacenamiento rechazó la escritura.');
      localStorage.setItem(receiptKey,JSON.stringify(receiptSnapshot(pending)));
      message('Respaldo escrito y comprobado. Reiniciando para verificar que la partida cargue…');
      window.location.reload();
    } catch(error) {
      message('No se pudo restaurar: '+(error?.message||error)+'. No borres el JSON original.',true);
    }
  }
  importButton.addEventListener('click', restoreSelected);
  pasteButton?.addEventListener('click',()=>{
    const text=pasteInput?.value||'';
    if(!text.trim()) {message('Pega primero el contenido del archivo JSON.',true);return;}
    prepareImport(text,'Texto pegado');
  });
  showPreviousRestore();
})();
