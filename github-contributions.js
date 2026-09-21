(() => {
  const snapshot = window.GITHUB_CONTRIBUTIONS_SNAPSHOT;
  const root = document.querySelector('#contribution-calendar');
  const status = document.querySelector('#contribution-status');
  const total = document.querySelector('#contribution-total');
  const namespace = 'http://www.w3.org/2000/svg';

  if (!snapshot?.days?.length) {
    status.textContent = 'Contribution calendar unavailable';
    root.innerHTML = '<p class="contribution-fallback">The calendar could not be loaded. Recent public events remain available below.</p>';
    return;
  }

  const first = new Date(snapshot.firstDate + 'T00:00:00');
  const days = snapshot.days.map(([count, level], index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index);
    return { date: date.toISOString().slice(0, 10), count, level };
  });
  const size = 10, gap = 3, left = 33, top = 22;
  const offset = first.getDay();
  const weeks = Math.ceil((offset + days.length) / 7);
  const width = left + weeks * (size + gap);
  const height = top + 7 * (size + gap) + 18;
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `GitHub contribution calendar for the year ending ${snapshot.updated}`);
  svg.classList.add('contribution-svg');

  ['Mon', 'Wed', 'Fri'].forEach((label, index) => {
    const text = document.createElementNS(namespace, 'text');
    text.setAttribute('x', '0');
    text.setAttribute('y', String(top + (index * 2 + 1) * (size + gap) + 8));
    text.textContent = label;
    text.classList.add('contribution-day-label');
    svg.append(text);
  });

  let previousMonth = -1;
  days.forEach((day, index) => {
    const position = offset + index;
    const week = Math.floor(position / 7);
    const weekday = position % 7;
    const cell = document.createElementNS(namespace, 'rect');
    cell.setAttribute('x', String(left + week * (size + gap)));
    cell.setAttribute('y', String(top + weekday * (size + gap)));
    cell.setAttribute('width', String(size));
    cell.setAttribute('height', String(size));
    cell.setAttribute('rx', '2');
    cell.setAttribute('class', 'contribution-cell level-' + Math.max(0, Math.min(4, day.level)));
    const title = document.createElementNS(namespace, 'title');
    title.textContent = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`;
    cell.append(title);
    svg.append(cell);
    const date = new Date(day.date + 'T00:00:00');
    if (date.getMonth() !== previousMonth && date.getDate() <= 7) {
      const label = document.createElementNS(namespace, 'text');
      label.setAttribute('x', String(left + week * (size + gap)));
      label.setAttribute('y', '11');
      label.textContent = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date);
      label.classList.add('contribution-month-label');
      svg.append(label);
      previousMonth = date.getMonth();
    }
  });

  root.replaceChildren(svg);
  total.textContent = Number(snapshot.total).toLocaleString('en-GB');
  status.textContent = 'Public GitHub data · updated ' + new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(snapshot.updated + 'T00:00:00'));
})();
