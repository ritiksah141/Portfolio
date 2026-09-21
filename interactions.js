(() => {
  const activityStatus = document.querySelector('#github-status');
  const activityList = document.querySelector('#github-events');
  const activityController = new AbortController();
  const activityTimeout = setTimeout(() => activityController.abort(), 8000);
  fetch('https://api.github.com/users/ritiksah141/events/public?per_page=5', {
    signal: activityController.signal,
    headers: { Accept: 'application/vnd.github+json' }
  }).then(response => {
    if (!response.ok) throw new Error('GitHub unavailable');
    return response.json();
  }).then(events => {
    if (!Array.isArray(events)) throw new Error('Invalid GitHub response');
    const verbs = { PushEvent: 'Pushed changes to', PullRequestEvent: 'Pull request activity in', IssuesEvent: 'Issue activity in', IssueCommentEvent: 'Commented in', PullRequestReviewEvent: 'Reviewed work in', CreateEvent: 'Created a branch or repository in', ForkEvent: 'Forked', WatchEvent: 'Starred' };
    const valid = events.filter(event => typeof event.repo?.name === 'string' && /^[\w.-]+\/[\w.-]+$/.test(event.repo.name) && !Number.isNaN(Date.parse(event.created_at)));
    valid.forEach(event => {
      const item = document.createElement('li');
      const action = document.createElement('span');
      action.textContent = verbs[event.type] || 'Public activity in';
      const link = document.createElement('a');
      link.textContent = event.repo.name;
      link.href = 'https://github.com/' + event.repo.name;
      link.target = '_blank';
      link.rel = 'noreferrer';
      const date = document.createElement('time');
      date.dateTime = event.created_at;
      date.textContent = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(event.created_at));
      item.append(action, link, date);
      activityList.append(item);
    });
    activityStatus.textContent = valid.length ? 'Fetched from GitHub' : 'No recent public events returned';
  }).catch(() => {
    activityStatus.textContent = 'Activity unavailable. Visit the GitHub profile below.';
  }).finally(() => clearTimeout(activityTimeout));
  const projectGrid = document.querySelector('#project-grid');
  const expandProjects = document.createElement('button');
  expandProjects.type = 'button';
  expandProjects.className = 'button';
  expandProjects.textContent = 'Explore more projects';
  expandProjects.setAttribute('aria-expanded', 'false');
  expandProjects.setAttribute('aria-controls', 'project-grid');
  let expanded = false;
  const updateProjectVisibility = () => {
    const allSelected = document.querySelector('[data-filter="all"]').classList.contains('active');
    [...projectGrid.children].forEach((card, index) => card.hidden = allSelected && !expanded && index >= 3);
    expandProjects.hidden = !allSelected;
    expandProjects.textContent = expanded ? 'Show featured projects' : 'Explore more projects';
    expandProjects.setAttribute('aria-expanded', String(expanded));
  };
  document.querySelector('#work .section-action').prepend(expandProjects);
  expandProjects.addEventListener('click', () => {
    expanded = !expanded;
    updateProjectVisibility();
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', updateProjectVisibility));
  updateProjectVisibility();
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const skills = document.querySelector('.skill-rails');
  const motionButton = document.createElement('button');
  motionButton.className = 'motion-control';
  motionButton.type = 'button';
  let motionPaused = motionPreference.matches;
  const updateMotion = () => {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    skills.classList.toggle('motion-paused', motionPaused);
    document.querySelector('.ticker-tile').classList.toggle('motion-paused', motionPaused);
    motionButton.textContent = motionPaused ? 'Play motion' : 'Pause motion';
    motionButton.setAttribute('aria-pressed', String(motionPaused));
  };
  skills.after(motionButton);
  motionButton.addEventListener('click', () => {
    motionPaused = !motionPaused;
    updateMotion();
  });
  motionPreference.addEventListener('change', event => {
    motionPaused = event.matches;
    updateMotion();
  });
  skills.querySelectorAll(':scope > div').forEach(row => {
    const label = row.querySelector('strong');
    const track = document.createElement('div');
    track.className = 'skill-track';
    const group = document.createElement('div');
    group.className = 'skill-group';
    [...row.querySelectorAll('span')].forEach(item => group.append(item));
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    track.append(group, duplicate);
    row.replaceChildren(label, track);
  });
  updateMotion();
  const aboutToggle = document.querySelector('#about-toggle');
  const aboutLinks = document.querySelector('#about-links');
  const closeAbout = () => {
    aboutLinks.hidden = true;
    aboutToggle.setAttribute('aria-expanded', 'false');
  };
  aboutToggle.addEventListener('click', () => {
    aboutLinks.hidden = !aboutLinks.hidden;
    aboutToggle.setAttribute('aria-expanded', String(!aboutLinks.hidden));
  });
  aboutLinks.addEventListener('click', event => {
    if (event.target.closest('a')) closeAbout();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.about-menu')) closeAbout();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !aboutLinks.hidden) {
      closeAbout();
      aboutToggle.focus();
    }
  });
  const input = document.querySelector('#terminal-input');
  const form = document.querySelector('#terminal-form');
  const history = [];
  let position = 0;
  let draft = '';
  const commands = ['help', 'about', 'projects', 'project openshield', 'project dusk', 'project iotsentinel', 'project breachlens', 'project threatvault', 'skills', 'experience', 'education', 'proof', 'resume', 'github', 'linkedin', 'contact', 'clear', 'matrix', 'stop', 'theme', 'theme matrix', 'theme amber', 'theme ice', 'neofetch'];
  form.addEventListener('submit', () => {
    const command = input.value.trim();
    if (command && history.at(-1) !== command) history.push(command);
    position = history.length;
    draft = '';
  }, true);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (position === history.length) draft = input.value;
      position = Math.max(0, Math.min(history.length, position + (event.key === 'ArrowUp' ? -1 : 1)));
      input.value = position === history.length ? draft : history[position];
      input.setSelectionRange(input.value.length, input.value.length);
    }
    if (event.key === 'Tab' && input.value.trim()) {
      const matches = commands.filter(command => command.startsWith(input.value.toLowerCase()));
      if (matches.length === 1) {
        event.preventDefault();
        input.value = matches[0];
      }
    }
  });
  const tabs = [...document.querySelectorAll('[data-expertise]')];
  const panel = document.querySelector('#expertise-panel');
  tabs.forEach((tab, index) => {
    tab.id = 'expertise-tab-' + index;
    tab.setAttribute('aria-controls', panel.id);
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener('click', () => {
      tabs.forEach(item => item.tabIndex = item === tab ? 0 : -1);
      panel.setAttribute('aria-labelledby', tab.id);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].click();
        tabs[next].focus();
      }
    });
  });
  panel.setAttribute('aria-labelledby', tabs[0].id);
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
  });
})();
// Portfolio totals are derived from the displayed evidence, never visitor estimates.
// Compact line icons and ordering mirror the reference navigation.
(() => {
  const nav = document.querySelector('.pill-nav');
  nav.insertBefore(nav.querySelector('a[href="#skills"]'), nav.querySelector('a[href="#work"]'));
  const paths = {
    Home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    About: '<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
    Skills: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
    Work: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18m-11 0v3h4v-3"/>',
    Contact: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m2 5 10 8L22 5"/>'
  };
  [...nav.children].forEach(item => {
    const control = item.matches('a') ? item : item.querySelector('button');
    const label = control.textContent.trim().split(' ')[0];
    if (!paths[label]) return;
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('class', 'nav-icon');
    icon.innerHTML = paths[label];
    control.prepend(icon);
  });
})();
document.querySelector('#work-project-count').textContent = PORTFOLIO_DATA.projects.length;
document.querySelector('#work-stack-count').textContent = new Set(PORTFOLIO_DATA.projects.flatMap(project => project.stack)).size;
document.querySelector('#work-area-count').textContent = new Set(PORTFOLIO_DATA.projects.flatMap(project => project.tags)).size;
document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => {
    const input = document.querySelector('#terminal-input');
    input.value = button.dataset.command;
    document.querySelector('#terminal-form').requestSubmit();
    input.focus();
  });
});

// Reveal content on entry without making it dependent on animation support.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.section-heading, .reference-bento .bento-card, .credential-card, .timeline li, .lifecycle-stage, .github-panel');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    targets.forEach((element, index) => {
      element.classList.add('reveal-on-entry');
      element.style.setProperty('--reveal-delay', (index % 3) * 65 + 'ms');
      reveal.observe(element);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        targets.forEach(element => element.classList.add('is-revealed'));
        reveal.disconnect();
      }
    });
  }

  const heading = document.querySelector('#work h2');
  const phrases = [
    ['Building Reliable', 'Software Systems'],
    ['Engineering Secure', 'Cloud Platforms'],
    ['Contributing to', 'Open Source']
  ];
  // Keep an unchanging accessible heading while the visual phrases rotate.
  heading.setAttribute('aria-label', 'Software systems, cloud platforms and open-source projects');
  const visual = document.createElement('span');
  visual.className = 'work-heading-visual';
  visual.setAttribute('aria-hidden', 'true');
  heading.replaceChildren(visual);
  let phraseIndex = 0;
  const renderPhrase = () => {
    visual.replaceChildren(document.createTextNode(phrases[phraseIndex][0]), document.createElement('br'), document.createTextNode(phrases[phraseIndex][1]));
  };
  renderPhrase();
  setInterval(() => {
    const bounds = heading.getBoundingClientRect();
    if (document.hidden || reducedMotion.matches || document.documentElement.classList.contains('motion-paused') || bounds.bottom < 0 || bounds.top > innerHeight) return;
    visual.classList.add('phrase-exit');
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      renderPhrase();
      visual.classList.remove('phrase-exit');
    }, 240);
  }, 4500);
})();
