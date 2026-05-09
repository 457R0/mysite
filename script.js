(function () {
  'use strict';

  var isSapotama = false;
  var curPanel = 0;
  var PANELS = 3;

  var websiteView = document.getElementById('websiteView');
  var sapotamaView = document.getElementById('sapotamaView');
  var toggle = document.getElementById('modeToggle');
  var modeLabel = document.getElementById('modeLabel');
  var flash = document.getElementById('dvFlash');
  var screenEl = document.getElementById('dvScreen');
  var dvBody = document.querySelector('.dv-body');

  var navTabs = Array.from(document.querySelectorAll('.dv-nav-tab'));
  var btnHome = document.getElementById('homebutton');

  function doFlash(cb) {
    flash.classList.add('go');
    flash.addEventListener('animationend', function handler() {
      flash.classList.remove('go');
      flash.removeEventListener('animationend', handler);
      if (cb) cb();
    });
  }

  function setLeds(panel) {
    var colors = ['var(--red-light)', 'var(--yellow)', 'var(--lcd-green)'];
    dvBody.style.setProperty('--glow-color', colors[panel]);
  }

  function goToPanel(next) {
    if (next === curPanel) return;
    var panels = screenEl.querySelectorAll('.dv-panel');
    panels[curPanel].classList.add('exit');
    panels[curPanel].classList.remove('active');

    var prev = curPanel;
    curPanel = ((next % PANELS) + PANELS) % PANELS;

    panels[curPanel].classList.remove('exit');
    panels[curPanel].classList.add('active');

    setTimeout(function() { panels[prev].classList.remove('exit'); }, 320);

    navTabs.forEach(function(t) {
      t.classList.toggle('active', parseInt(t.dataset.panel) === curPanel);
    });
    setLeds(curPanel);
  }

  function switchToSapotama() {
    doFlash(function() {
      websiteView.hidden = true;
      sapotamaView.hidden = false;
      modeLabel.textContent = 'WEBSITE MODE';
      isSapotama = true;
    });
  }

  function switchToWebsite() {
    doFlash(function() {
      sapotamaView.hidden = true;
      websiteView.hidden = false;
      modeLabel.textContent = 'SAPOTAMA MODE';
      isSapotama = false;
    });
  }

  toggle.addEventListener('click', function() {
    if (!isSapotama) switchToSapotama();
    else switchToWebsite();
  });

  navTabs.forEach(function(tab) {
    tab.addEventListener('click', function() { goToPanel(parseInt(tab.dataset.panel)); });
  });

  btnHome.addEventListener('click', function() {
    btnHome.classList.add('pressed');
    setTimeout(function() { btnHome.classList.remove('pressed'); }, 150);
    goToPanel(0);
  });

  document.addEventListener('keydown', function(e) {
    if (!isSapotama) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goToPanel(curPanel + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goToPanel(curPanel - 1); }
    if (e.key === 'Escape') switchToWebsite();
  });

  function updateTime() {
    var now = new Date();
    document.getElementById('dvTime').textContent =
      now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }
  updateTime();
  setInterval(updateTime, 1000);

  setLeds(0);
})();
