/* No automatic reload: preserve the live save before opening the explicit updater. */
(()=>{
 const button=document.getElementById('atlasUpdateLaunch');
 const native=['android','ios'].includes(window.Capacitor?.getPlatform?.());
 const open=()=>{try{if(window.AtlasSaveBridge?.persistBeforeUpdate?.()===false)return;location.assign('./actualizar-v3230.html');}catch(error){const status=document.getElementById('saveManagerStatus');if(status)status.textContent='No se pudo guardar antes de actualizar. Exporta la partida desde Respaldos.';}};
 if(button){button.hidden=native;button.addEventListener('click',open);}
 if(native||!('serviceWorker'in navigator))return;
 navigator.serviceWorker.ready.then(registration=>{let shown=false;const show=()=>{if(shown||!registration.waiting)return;shown=true;const notice=document.createElement('button');notice.type='button';notice.id='atlasUpdateNotice';notice.textContent='Actualización disponible · Guardar y actualizar';notice.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(65px + env(safe-area-inset-bottom));z-index:60;min-height:48px;padding:10px;background:#355d43;color:#fff3d4;border:1px solid #bca46d;border-radius:10px;font:700 13px system-ui;cursor:pointer';notice.addEventListener('click',open);document.body.appendChild(notice);};show();registration.addEventListener('updatefound',()=>registration.installing?.addEventListener('statechange',()=>{if(registration.waiting)show();}));}).catch(()=>{});
})();
