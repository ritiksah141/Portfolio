(() => {
  const icons = {
    Python: 'python', Java: 'java', SQL: 'sql', PHP: 'php', Bash: 'bash', Flask: 'flask',
    'REST APIs': 'rest', 'Angular 17': 'angular', 'Microsoft Azure': 'azure', Docker: 'docker',
    Linux: 'linux', 'GitHub Actions': 'github-actions', 'CI/CD': 'cicd', 'Key Vault': 'key-vault',
    'Logic Apps': 'logic-apps', PostgreSQL: 'postgresql', MongoDB: 'mongodb', SQLite: 'sqlite',
    Redis: 'redis', 'Cosmos DB': 'cosmos-db', Zeek: 'zeek', 'River ML': 'river-ml',
    'Raspberry Pi': 'raspberry-pi'
  };
  document.querySelectorAll('.skill-group span').forEach(tile => {
    const label = tile.textContent.trim();
    const image = document.createElement('img');
    image.className = 'skill-symbol';
    image.src = `assets/tech-icons/${icons[label]}.svg`;
    image.alt = '';
    image.width = 56;
    image.height = 56;
    image.loading = 'lazy';
    tile.prepend(image);
  });
})();
