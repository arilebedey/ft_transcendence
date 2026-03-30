Synthèse rapide: j'ai audité le frontend — il existe déjà des tokens de couleur et >10 composants réutilisables, mais la typographie et la gestion centralisée des icônes/tokens manquent de formalisation et de documentation. Je propose des corrections prioritaires et actions concrètes.

Fichiers inspectés

Palette / tokens: index.css:1-120 (thèmes forest / dark-blue / light déclarés via CSS variables)
Composants UI réutilisables: exemples dans button.tsx:1-50, card.tsx:1-40, input.tsx:1-60 et plusieurs autres sous components (liste trouvée)
Icônes: usage direct de lucide-react dans de nombreux composants (ex. ThemeToggle.tsx:1-40)
Tailwind / config: @tailwindcss/postcss est présent (package.json), mais il n’y a pas de tailwind.config explicite dans le repo pour exposer des couleurs/typographie nommées.
Constat (court)

Les couleurs sont déjà exposées via CSS variables et thèmes (bon point).
Il y a >10 composants « réutilisables » (ui/button, card, input, avatar, label, list-item, post-card, tooltip, title, list-card…).
– Pas de tokens typographiques centralisés (taille, échelle, familles, leading) ni d’import de police explicite.
– Les classes Tailwind utilisées (bg-primary, text-primary-foreground, etc.) supposent une map entre noms sémantiques et variables — mais aucun tailwind.config central n’expose/garantit ceci.
– Icônes importées partout directement depuis lucide-react → difficile de contrôler taille, couleur, accessibilité, poids, ou de remplacer la bibliothèque en un seul endroit.
– Peu (ou pas) de documentation / catalogue de composants ni guidelines (props, variantes, tokens attendus, exemples).
Recommandations (prioritaires, concrètes)

Centraliser les design tokens: extraire les variables couleur/typographie dans un fichier frontend/src/styles/tokens.css (ou tokens.css + tokens.ts) et documenter les rôles sémantiques (primary, background, surface, border, etc.).
Ajouter tailwind.config: créer frontend/tailwind.config.cjs qui mappe les couleurs et polices aux CSS variables (ex. primary: 'var(--color-primary)') afin que bg-primary / text-primary-foreground soient robustes et détectables par l’équipe.
Définir une échelle typographique: ajouter variables pour --font-sans, --type-scale-xxl… + classes utilitaires / tokens Tailwind; importer une police (ex. Inter) dans index.css.
Centraliser les icônes: créer frontend/src/components/Icon.tsx ou frontend/src/lib/icons.tsx qui enveloppe lucide-react et impose taille, aria-labels, color token usage — facilite le changement futur de bibliothèque.
Documenter le catalogue: créer un README ou simple Storybook / MDX avec la liste des composants réutilisables, variantes et tokens requis (commencer par les 10+ composants UI).
Accessibilité & contrast: exécuter checks contrast (axe/pa11y) sur les thèmes; ajuster couleurs si contrast insuffisant (priorité: textes, boutons, états focus).
Patterns & conventions: définir conventions d’utilisation des tokens (ex.: toujours utiliser bg-[var(--color-primary)] ou bg-primary selon tailwind.config), et ajouter exemples dans frontend/CONTRIBUTING.md ou docs/design-system.md.
Plan d’action recommandé (court, trié)

Créer frontend/tailwind.config.cjs + map couleurs → CSS vars (haut impact).
Extraire/centraliser tokens dans frontend/src/styles/tokens.css.
Ajouter variables typographiques + importer police dans index.css.
Ajouter frontend/src/components/Icon.tsx wrapper pour icônes.
Documenter composants (README ou Storybook) et lancer audit accessibilité.
