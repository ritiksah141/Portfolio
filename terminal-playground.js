(() => {
  const dialog = document.querySelector('#terminal-dialog');
  const form = document.querySelector('#terminal-form');
  const input = document.querySelector('#terminal-input');
  const output = document.querySelector('#terminal-output');
  const shortcuts = document.querySelector('.terminal-shortcuts');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let rainTimer;
  const rain = document.createElement('div');
  rain.className = 'matrix-rain';
  rain.setAttribute('aria-hidden', 'true');
  dialog.append(rain);
  const themes = ['matrix', 'amber', 'ice'];
  dialog.dataset.theme = 'matrix';
  const themeButton = dialog.querySelector('.terminal-theme') || document.createElement('button');
  themeButton.type = 'button';
  themeButton.className = 'terminal-theme';
  themeButton.textContent = 'theme: matrix';
  themeButton.setAttribute('aria-label', 'Change terminal colour theme');
  if (!themeButton.isConnected) dialog.querySelector('.dialog-bar').insertBefore(themeButton, dialog.querySelector('[data-close]'));
  const line = text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    output.append(paragraph);
    output.scrollTop = output.scrollHeight;
  };
  const setTheme = theme => {
    if (!themes.includes(theme)) {
      line('Available themes: matrix, amber, ice.');
      return;
    }
    dialog.dataset.theme = theme;
    themeButton.textContent = 'theme: ' + theme;
  };
  const stopRain = () => {
    clearTimeout(rainTimer);
    rain.replaceChildren();
    dialog.classList.remove('matrix-active');
  };
  const startRain = () => {
    stopRain();
    if (reduced.matches || document.documentElement.classList.contains('motion-paused')) {
      line('Matrix animation is paused by your motion preference.');
      return;
    }
    const characters = '01<>/{}[]+*';
    for (let column = 0; column < 28; column++) {
      const stream = document.createElement('span');
      stream.textContent = Array.from({length: 24}, () => characters[Math.floor(Math.random() * characters.length)]).join('\n');
      stream.style.left = (column / 28 * 100) + '%';
      stream.style.animationDelay = -(Math.random() * 4) + 's';
      stream.style.animationDuration = (2 + Math.random() * 3) + 's';
      rain.append(stream);
    }
    dialog.classList.add('matrix-active');
    line('Matrix visual effect: 8 seconds. Type stop to end it.');
    rainTimer = setTimeout(stopRain, 8000);
  };
  themeButton.addEventListener('click', () => setTheme(themes[(themes.indexOf(dialog.dataset.theme) + 1) % themes.length]));
  for (const command of ['matrix', 'theme', 'neofetch']) {
    if (shortcuts.querySelector(`[data-command="${command}"]`)) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = command;
    button.addEventListener('click', () => {
      input.value = command;
      form.requestSubmit();
      input.focus();
    });
    shortcuts.append(button);
  }
  form.addEventListener('submit', event => {
    const command = input.value.trim().toLowerCase();
    if (!/^(matrix|stop|theme(?:\s+\S+)?|neofetch)$/.test(command)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    line('visitor@portfolio:~$ ' + input.value.trim());
    input.value = '';
    if (command === 'matrix') startRain();
    else if (command === 'stop') { stopRain(); line('Visual effect stopped.'); }
    else if (command === 'neofetch') line('Ritik Portfolio CLI\nRuntime: your web browser\nMode: local portfolio playground\nTheme: ' + dialog.dataset.theme + '\nData: public portfolio content\nNo shell, filesystem or network access is provided by this console.');
    else setTheme(command.split(/\s+/)[1] || themes[(themes.indexOf(dialog.dataset.theme) + 1) % themes.length]);
  }, true);
  dialog.addEventListener('close', stopRain);
  reduced.addEventListener('change', event => { if (event.matches) stopRain(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopRain(); });
  new MutationObserver(() => {
    if (document.documentElement.classList.contains('motion-paused')) stopRain();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();
