(function () {
  var KEY = 'cookie-notice-ok';
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  function show() {
    var st = document.createElement('style');
    st.textContent = '.ck-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;box-sizing:border-box;display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:14px 16px;background:#ffffff;color:#11131B;border:1.5px solid #11131B;border-radius:14px;box-shadow:4px 4px 0 #11131B;font:400 14px/1.45 Onest,Segoe UI,Arial,sans-serif}.ck-bar p{margin:0;flex:1 1 220px}.ck-bar a{color:inherit;text-decoration:underline}.ck-bar button{flex:0 0 auto;cursor:pointer;border:0;border-radius:999px;padding:11px 20px;background:#11131B;color:#ffffff;font:600 14px/1 Onest,Segoe UI,Arial,sans-serif}.ck-bar button:focus-visible{outline:3px solid #2A39E8;outline-offset:2px}@media(min-width:640px){.ck-bar{left:20px;right:auto}}';
    document.head.appendChild(st);
    var b = document.createElement('div');
    b.className = 'ck-bar';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Уведомление о cookie');
    b.innerHTML = '<p>Сайт сохраняет в браузере технические данные (cookie и localStorage), чтобы работать корректно. Подробнее в <a href="privacy.html">политике конфиденциальности</a>.</p><button type="button">Понятно</button>';
    b.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      b.remove();
    });
    document.body.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
