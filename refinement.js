(() => {
  const cardIcons = [
    ['.maintainer-tile', 'maintainer'], ['.showcase-tile', 'showcase'],
    ['.tools-tile', 'tools'], ['.disciplines-tile', 'disciplines'],
    ['.profiles-tile', 'profiles'], ['.evidence-tile', 'evidence']
  ];
  cardIcons.forEach(([selector, name]) => {
    const card = document.querySelector(selector);
    if (!card) return;
    const icon = document.createElement('img');
    icon.className = 'card-icon';
    icon.src = `assets/ui-icons/${name}.svg`;
    icon.alt = '';
    icon.width = 24;
    icon.height = 24;
    card.prepend(icon);
  });

  ['journey-work', 'journey-study', 'journey-open', 'journey-award'].forEach((name, index) => {
    const slot = document.querySelectorAll('.timeline-icon')[index];
    if (!slot) return;
    const icon = document.createElement('img');
    icon.src = `assets/ui-icons/${name}.svg`;
    icon.alt = '';
    icon.width = 21;
    icon.height = 21;
    slot.replaceChildren(icon);
  });

  ['maintainer', 'showcase', 'journey-award', 'evidence'].forEach((name, index) => {
    const slot = document.querySelectorAll('.credential-symbol')[index];
    if (!slot) return;
    const icon = document.createElement('img');
    icon.src = `assets/ui-icons/${name}.svg`;
    icon.alt = '';
    icon.width = 28;
    icon.height = 28;
    slot.replaceChildren(icon);
  });

  const terminal = document.querySelector('#terminal-dialog');
  const expand = terminal?.querySelector('[data-terminal-action="expand"]');
  const minimise = terminal?.querySelector('[data-terminal-action="minimise"]');

  expand?.addEventListener('click', () => {
    terminal.classList.remove('is-minimised');
    terminal.classList.toggle('is-expanded');
    const expanded = terminal.classList.contains('is-expanded');
    expand.setAttribute('aria-label', expanded ? 'Restore terminal size' : 'Expand terminal');
    expand.setAttribute('aria-pressed', String(expanded));
  });

  minimise?.addEventListener('click', () => {
    terminal.classList.remove('is-expanded');
    terminal.classList.toggle('is-minimised');
    const minimised = terminal.classList.contains('is-minimised');
    minimise.setAttribute('aria-label', minimised ? 'Restore terminal' : 'Minimise terminal');
    minimise.setAttribute('aria-pressed', String(minimised));
  });

  terminal?.addEventListener('close', () => {
    terminal.classList.remove('is-expanded', 'is-minimised');
    expand?.setAttribute('aria-pressed', 'false');
    minimise?.setAttribute('aria-pressed', 'false');
  });

  document.querySelectorAll('.credential-card[role="button"]').forEach(card => {
    const activate = () => {
      const active = !card.classList.contains('is-active');
      document.querySelectorAll('.credential-card.is-active').forEach(item => {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    };
    card.addEventListener('click', event => {
      if (!event.target.closest('a')) activate();
    });
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activate();
    });
  });

  const credentialDialog = document.querySelector('#credential-dialog');
  const credentialImage = document.querySelector('#credential-dialog-image');
  const credentialTitle = document.querySelector('#credential-dialog-title');
  const credentialSource = document.querySelector('#credential-dialog-source');
  const openCredential = trigger => {
    if (!credentialDialog || !credentialImage || !credentialTitle || !credentialSource) return;
    const src = trigger.dataset.credentialSrc;
    const title = trigger.dataset.credentialTitle || 'Credential preview';
    if (!src) return;
    credentialImage.src = src;
    credentialImage.alt = title;
    credentialTitle.textContent = title;
    const source = trigger.dataset.credentialLink;
    credentialSource.hidden = !source;
    if (source) credentialSource.href = source;
    credentialDialog.showModal();
  };
  document.querySelectorAll('[data-credential-src]').forEach(trigger => {
    trigger.addEventListener('click', () => openCredential(trigger));
  });
  credentialDialog?.querySelector('[data-credential-close]')?.addEventListener('click', () => credentialDialog.close());
  credentialDialog?.addEventListener('click', event => {
    if (event.target === credentialDialog) credentialDialog.close();
  });

  const technologyPhrase = document.querySelector('#technology-phrase');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const phrases = ['engineer with', 'ship products with', 'secure systems with', 'learn deeply with'];
  let phraseIndex = 0;
  if (technologyPhrase) {
    setInterval(() => {
      if (document.hidden || reducedMotion.matches || document.documentElement.classList.contains('motion-paused')) return;
      technologyPhrase.classList.add('is-changing');
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        technologyPhrase.textContent = phrases[phraseIndex];
        technologyPhrase.classList.remove('is-changing');
      }, 220);
    }, 3200);
  }

  const activityList = document.querySelector('#github-events');
  const addActivityIcons = () => {
    activityList?.querySelectorAll('li:not([data-icon-ready])').forEach(item => {
      const icon = document.createElement('img');
      icon.className = 'activity-icon';
      icon.src = 'assets/ui-icons/journey-open.svg';
      icon.alt = '';
      icon.width = 20;
      icon.height = 20;
      item.prepend(icon);
      item.dataset.iconReady = 'true';
    });
  };
  if (activityList) {
    new MutationObserver(addActivityIcons).observe(activityList, { childList: true });
    addActivityIcons();
  }

  const hero = document.querySelector('.hero');
  if (hero) {
    let heroFrame = 0;
    const updateHeroMotion = () => {
      heroFrame = 0;
      if (reducedMotion.matches || document.documentElement.classList.contains('motion-paused')) {
        hero.style.setProperty('--hero-scroll', '0');
        return;
      }
      const bounds = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(bounds.height * .82, 1)));
      hero.style.setProperty('--hero-scroll', progress.toFixed(4));
      hero.classList.toggle('hero-scroll-ready', progress > .015);
    };
    const requestHeroMotion = () => {
      if (!heroFrame) heroFrame = requestAnimationFrame(updateHeroMotion);
    };
    addEventListener('scroll', requestHeroMotion, { passive: true });
    addEventListener('resize', requestHeroMotion, { passive: true });
    reducedMotion.addEventListener('change', requestHeroMotion);
    requestAnimationFrame(() => {
      hero.classList.add('hero-motion-ready');
      updateHeroMotion();
    });
  }
})();
