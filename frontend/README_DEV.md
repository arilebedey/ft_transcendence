# README_DEV.md — Frontend Developer Guide

**Version:** 1.0 | **Last Updated:** Feb 2026 | **Stack:** React 18 + TypeScript + Tailwind + Radix UI

---

## 📋 Table des matières

1. [Structure du Projet](#structure-du-projet)
2. [Setup & Installation](#setup--installation)
3. [Architecture & Conventions](#architecture--conventions)
4. [Design System](#design-system)
5. [Créer un Nouveau Composant](#créer-un-nouveau-composant)
6. [Étendre le Design System](#étendre-le-design-system)
7. [Checklist Qualité](#checklist-qualité)
8. [Troubleshooting](#troubleshooting)

---

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Design System primitives (button, card, input, etc.)
│   │   │   ├── button.tsx         # Variantes: primary, secondary, ghost, link, destructive
│   │   │   ├── card.tsx           # Container standard pour contenu groupé
│   │   │   ├── input.tsx          # Input texte
│   │   │   ├── list-card.tsx      # Wrapper générique pour listes (NEW)
│   │   │   ├── list-item.tsx      # Item réutilisable pour listes (NEW)
│   │   │   └── post-card.tsx      # Card spécialisée pour posts sociaux (NEW)
│   │   │
│   │   ├── Layout.tsx             # Page wrapper principal (Header, main, Footer)
│   │   ├── Header.tsx             # Navigation header
│   │   ├── BottomNav.tsx          # Mobile navigation (bottom)
│   │   ├── ThemeToggle.tsx        # Light/dark mode switcher
│   │   │
│   │   ├── auth/                  # Auth related components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── FormField.tsx      # Wrapper pour inputs avec label/error
│   │   │
│   │   ├── FriendsList.tsx        # Affiche friends (étendu de ListCard)
│   │   ├── TrendingList.tsx       # Affiche tendances (étendu de ListCard)
│   │   └── ...autres composants métier
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Home page (feed de posts)
│   │   ├── Auth.tsx               # Login/signup page
│   │   ├── Profile.tsx            # User profile
│   │   ├── Network.tsx            # Friends/network page
│   │   └── NotFound.tsx           # 404 page
│   │
│   ├── hooks/
│   │   ├── useTheme.ts            # Gère light/dark mode
│   │   ├── use-toast.ts           # Toast notifications
│   │   └── use-mobile.tsx         # Mobile breakpoint detection
│   │
│   ├── lib/
│   │   ├── utils.ts               # Utilitaires (cn, etc.)
│   │   ├── auth-client.ts         # Client API auth (better-auth)
│   │   └── ...autres helpers
│   │
│   ├── stores/                    # State management (minimal)
│   │
│   ├── App.tsx                    # Root component (routing, providers)
│   ├── main.tsx                   # Entry point React
│   ├── index.css                  # Tokens CSS + Tailwind directives
│   └── vite-env.d.ts              # Types Vite
│
├── public/
├── tailwind.config.ts             # Tokens & animations Tailwind
├── postcss.config.js              # PostCSS plugins (Tailwind, autoprefixer)
├── vite.config.ts                 # Build config
├── tsconfig.json                  # TypeScript config
├── eslint.config.js               # Linting rules
└── package.json                   # Dependencies

```

---

## 🚀 Setup & Installation

### Prérequis

- Node.js >= 18
- npm >= 9

### Installation

```bash
cd frontend
npm install
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run lint     # Check code quality
npm run test     # Run tests (vitest)
```

### Erreurs Courantes

**Error: PostCSS plugin "tailwindcss" not found**
```bash
npm install -D @tailwindcss/postcss
# Update postcss.config.js to use "@tailwindcss/postcss"
```

**Composants Radix UI manquants**
```bash
npm install
# Réinstaller les dépendances si certaines import échouent
```

---

## 🏗️ Architecture & Conventions

### Nommage des fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Composant React | PascalCase | `UserProfile.tsx` |
| Hook custom | camelCase starts with `use` | `useTheme.ts`, `use-mobile.tsx` |
| Utilitaires | camelCase | `utils.ts`, `auth-client.ts` |
| Pages | PascalCase | `Profile.tsx`, `NotFound.tsx` |

### Structure un Composant

**Template idéal pour un nouveau composant:**

```tsx
/**
 * @component MyComponent
 * Description courte et claire du rôle du composant.
 * 
 * @props
 * - prop1: string - Description
 * - prop2?: number - Description (optionnel)
 * 
 * @state (si utilisé)
 * - internalState: string - État local avec son rôle
 * 
 * @example
 * <MyComponent prop1="value" prop2={42} />
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  prop1: string;
  prop2?: number;
  children?: ReactNode;
  className?: string;
}

export function MyComponent({
  prop1,
  prop2 = 0,
  children,
  className,
}: MyComponentProps) {
  // Logic here
  
  return (
    <div className={cn("base-classes", className)}>
      {/* JSX here */}
    </div>
  );
}
```

### Pattern: Composants Réutilisables vs Spécialisés

- **Primitives** (`src/components/ui/`): Bas-niveau, sans logique métier.
  - `Button`, `Card`, `Input`, `Avatar`
  - Exemple: `ListCard`, `ListItem`, `PostCard`

- **Composants métier** (`src/components/`): Logique applicative spécifique.
  - `FriendsList`, `TrendingList`, `Header`
  - Intègrent primitives + données/logique

---

## 🎨 Design System

### Tokens Couleur

Tous les tokens sont définis dans `src/index.css` et mappés Tailwind dans `tailwind.config.ts`.

**Light Mode:**
```css
--primary: 199 89% 48%;         /* Bleu principal */
--secondary: 210 20% 96%;       /* Gris clair */
--background: 210 20% 98%;      /* Fond page */
--foreground: 222 47% 11%;      /* Texte principal */
--muted: 210 15% 93%;           /* Éléments secondaires */
--success: 142 71% 45%;         /* Vert (status online, success) */
--warning: 38 92% 50%;          /* Orange (warnings) */
--destructive: 0 84% 60%;       /* Rouge (delete, errors) */
```

**Dark Mode:** Inversé dans `.dark` class.

### Utilisation dans le Code

❌ **MAUVAIS:** Hardcoded
```tsx
<div style={{ color: "#1E40AF", backgroundColor: "#F3F4F6" }}>
```

✅ **BON:** Classes Tailwind (tokens)
```tsx
<div className="text-primary bg-secondary">
```

✅ **BON:** Classes utilitaires directes (pixels simples)
```tsx
<div className="text-sm font-bold gap-2 p-4">
```

### Variantes de Composants

Les composants UI supportent `variant` et `size`:

```tsx
// Button variants
<Button variant="default" />       // Primary
<Button variant="secondary" />     // Secondary
<Button variant="ghost" />         // Transparent
<Button variant="link" />          // Lien texte
<Button variant="destructive" />   // Danger

// Sizes
<Button size="sm" />               // Small
<Button size="default" />          // Default
<Button size="lg" />               // Large
<Button size="icon" />             // Icon-only, 40x40
```

---

## ✏️ Créer un Nouveau Composant

### Étape 1: Primitive UI (si besoin d'une nouvelle)

**Quand créer:**
- Besoin partagé par 3+ composants
- Comportement interactif réutilisable
- Exemple: `Toast`, `Dialog`, `Dropdown`

**Où créer:**
```
src/components/ui/my-component.tsx
```

**Template:**
```tsx
/**
 * @component MyUIComponent
 * Description du composant.
 * 
 * @props
 * - variant?: 'default' | 'outline' - Apparence
 * - size?: 'sm' | 'md' | 'lg' - Taille
 * ...
 */

import { cn } from "@/lib/utils";

interface MyUIComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
}

export const MyUIComponent = React.forwardRef<
  HTMLDivElement,
  MyUIComponentProps
>(({ className, variant = "default", size = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative inline-flex items-center",
      variant === "default" && "bg-primary text-primary-foreground",
      variant === "outline" && "border border-primary",
      size === "sm" && "text-sm px-2 py-1",
      size === "md" && "text-base px-4 py-2",
      size === "lg" && "text-lg px-6 py-3",
      className,
    )}
    {...props}
  />
));
MyUIComponent.displayName = "MyUIComponent";

export { type MyUIComponentProps };
```

### Étape 2: Composant Métier

**Structure simple (pas de logique complexe):**
```tsx
/**
 * @component MyFeature
 * Affiche informations de l'utilisateur.
 */

interface Friend {
  id: string;
  name: string;
  status: "online" | "offline";
}

interface MyFeatureProps {
  friends: Friend[];
  onFriendClick?: (id: string) => void;
}

export function MyFeature({ friends, onFriendClick }: MyFeatureProps) {
  return (
    <ListCard title="Friends" icon={<UserIcon />}>
      {friends.map((f) => (
        <ListItem
          key={f.id}
          primary={f.name}
          badge={<span className={f.status === "online" ? "bg-success" : "bg-muted"} />}
          action={
            <button onClick={() => onFriendClick?.(f.id)}>Message</button>
          }
        />
      ))}
    </ListCard>
  );
}
```

**Structure avec hooks/état complexe:**
```tsx
/**
 * @component ComplexFeature
 * Composant avec logique interne.
 * 
 * @state
 * - selectedId: string - ID actuellement sélectionné
 */

import { useState } from "react";

export function ComplexFeature() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    // Logique métier ici
    setSelectedId(id);
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Étape 3: Export & Test

1. **Exporter du barrel** `src/components/index.ts` (optionnel mais recommandé)
   ```tsx
   export { MyFeature } from "./MyFeature";
   ```

2. **Ajouter tests basiques** (vitest)
   ```tsx
   // src/components/MyFeature.test.tsx
   import { describe, it, expect } from "vitest";
   import { render, screen } from "@testing-library/react";
   import { MyFeature } from "./MyFeature";

   describe("MyFeature", () => {
     it("renders without crashing", () => {
       render(<MyFeature friends={[]} />);
       expect(screen.getByText("Friends")).toBeInTheDocument();
     });
   });
   ```

3. **Tester dans l'app**
   ```bash
   npm run dev
   # Import et utiliser le composant dans une page
   ```

---

## 🔧 Étendre le Design System

### Ajouter une Nouvelle Couleur

1. **Ajouter token** dans `src/index.css`:
   ```css
   @layer base {
     :root {
       --my-color: 210 40% 60%;     /* HSL format */
     }
     .dark {
       --my-color: 210 40% 35%;
     }
   }
   ```

2. **Mapper dans Tailwind** (`tailwind.config.ts`):
   ```ts
   colors: {
     "my-color": "hsl(var(--my-color) / <alpha-value>)",
   }
   ```

3. **Utiliser dans le code**:
   ```tsx
   <div className="bg-my-color text-my-color">
   ```

### Ajouter une Animation

1. **Définir keyframes** dans `tailwind.config.ts`:
   ```ts
   keyframes: {
     "my-animation": {
       from: { opacity: "0", transform: "scale(0.95)" },
       to: { opacity: "1", transform: "scale(1)" },
     },
   }
   ```

2. **Mapper l'animation**:
   ```ts
   animation: {
     "my-animation": "my-animation 0.2s ease-out",
   }
   ```

3. **Utiliser**:
   ```tsx
   <div className="animate-my-animation">
   ```

### Ajouter une Variante de Composant

Exemple: Ajouter `variant="success"` au Button.

1. **Éditer** `src/components/ui/button.tsx`
2. **Ajouter dans le cva():**
   ```ts
   variant: {
     success: "bg-success text-success-foreground hover:bg-success/90",
   }
   ```
3. **Mettre à jour les types:**
   ```ts
   interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: "default" | "secondary" | "ghost" | "link" | "destructive" | "success";
   }
   ```

---

## ✅ Checklist Qualité

Avant de commit/PR, vérifier:

- [ ] **Naming**: Noms clairs, suit les conventions
- [ ] **JSDoc**: Chaque composant a un bloc `@component` avec props, state, ejemplo
- [ ] **Props typées**: Interfaces explicites, pas de `any`
- [ ] **Design System**: Utilise tokens couleur/spacing, pas de hardcoding
- [ ] **Réutilisabilité**: Extraire des patterns vers composants génériques
- [ ] **Accessibilité**: ARIA labels, keyboard nav, visible focus
  ```tsx
  <button aria-label="Close" className="focus:outline-none focus:ring-2">
  ```
- [ ] **Tests**: Au minimum `render` et "ne crash pas"
- [ ] **Imports**: Utiliser alias `@/` (configuré dans `tsconfig.json`), déduler code mort
- [ ] **Linting**: `npm run lint` passe sans erreurs
- [ ] **Mobile**: Testé sur écran petit (425px+)
- [ ] **Responsive**: Adapter layout avec Tailwind breakpoints (`sm:`, `md:`, `lg:`)

---

## 🔗 Patterns Communs

### Pattern: Données Stub → API

**Actuel** (stub data en dur):
```tsx
const posts = [{ id: 1, ... }];

export function FeedPage() {
  return posts.map(p => <PostCard {...p} />);
}
```

**APRÈS** (connecté API avec React Query):
```tsx
import { useQuery } from "@tanstack/react-query";

export function FeedPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then(r => r.json()),
  });

  if (isLoading) return <LoadingSpinner />;
  return posts.map(p => <PostCard {...p} />);
}
```

### Pattern: Formule Réutilisable

**ListCard + ListItem réduit la duplication:**

```tsx
// Avant: Code dupliqué dans 3 composants
<Card>
  <CardHeader>
    <CardTitle>Friends</CardTitle>
  </CardHeader>
  <CardContent>
    {items.map(item => (
      <div className="flex gap-3 p-3">...</div>
    ))}
  </CardContent>
</Card>

// Après: 1 ligne avec composants génériques
<ListCard title="Friends" icon={<Icon />}>
  {items.map(item => (
    <ListItem primary={item.name} secondary={item.username} />
  ))}
</ListCard>
```

---

## 🐛 Troubleshooting

### Problème: Bouton n'est pas cliquable

**Cause probable**: Événement parent capture le click
```tsx
<div onClick={handleDivClick}>
  <button onClick={handleButtonClick} />  {/* Clique va au div aussi */}
</div>
```

**Solution**: `stopPropagation()`
```tsx
<button onClick={(e) => {
  e.stopPropagation();
  handleButtonClick();
}} />
```

### Problème: Classes Tailwind n'apparaissent pas

**Cause**: Chemins incorrects dans `content` de `tailwind.config.ts`
```ts
content: ["./src/**/*.{ts,tsx}"],  // Assurer que ton fichier est inclus
```

### Problème: Types TypeScript non reconnus

**Cause**: `tsconfig.json` paths non configurés
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Problème: Animations ne jouent pas

**Cause**: Classe `animate-fade-in` non activée
- Vérifier que `src/index.css` définit les `@keyframes`
- Vérifier que `tailwind.config.ts` les mappe

---

## 📚 Ressources Externes

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [React Query](https://tanstack.com/query)
- [Lucide Icons](https://lucide.dev) — 300+ icônes

---

## 💬 Questions?

Si tu rencontres un problème:
1. Vérifie cette doc (CTRL+F ton erreur)
2. Cherche dans les issues GitHub
3. Demande dans le Slack équipe ou ouvre une issue

**Happy coding! 🚀**
