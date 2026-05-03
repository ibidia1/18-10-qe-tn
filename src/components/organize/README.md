# Module S'organiser — QE.tn

Maquette frontend du module de planification. Toutes les données tournent en **localStorage** (`qe.organize.v1`). Cette doc oriente l'équipe dev pour le branchement Supabase.

---

## Architecture

```
organize/
├── OrganizePage.tsx          # Point d'entrée, orchestre tout
├── data/
│   ├── types.ts               # Tous les types TypeScript (correspondent aux tables Supabase)
│   ├── courses.ts             # 75 cours mock
│   ├── series.ts              # Series QCM mock par cours
│   ├── userStats.ts           # KPI utilisateur mock (toggle KPI_ENABLED pour tester null)
│   ├── examDate.ts            # Date residanat (configurable via localStorage)
│   └── mockEvents.ts          # 25 evenements pré-remplis pour la demo
├── lib/
│   ├── dateUtils.ts           # Helpers dates (natif JS, locale FR) — remplacer par date-fns
│   ├── colors.ts              # Map type -> classes Tailwind (tiers good/mid/bad + eventColors)
│   ├── spacedRepetitionAlgo.ts # Logique pure SR (generateRevisions, reschedule, streak)
│   └── pdfExport.ts           # window.print() avec CSS injecte
├── hooks/
│   ├── useOrganizeStore.ts    # Store central localStorage -> TODO_SUPABASE
│   ├── useSpacedRepetition.ts # Reschedule + milestones au mount et toutes les 60s
│   ├── useEstimation.ts       # nb_qcm x KPI, arrondi 5min (null si KPI absent)
│   ├── useCourseSearch.ts     # Fuzzy search maison sur 75 cours
│   ├── useNotifications.ts    # Scan taches du jour + revisions en retard
│   ├── useDailyRitual.ts      # Detecte 1ere ouverture matin / >18h soir
│   └── useKeyboardShortcuts.ts # mod+K (recherche), N (ajouter)
├── header/                    # Barre du haut (countdown, mode, vue, cloche)
├── search/                    # Barre + modal + resultats + SeriesPickerPopover
├── calendar/                  # MonthView, WeekView, DayView, EventCard, CalendarView
├── panels/                    # BacklogPanel, TodayAgendaPanel, AutoModeConfig, NotificationsBell
├── views/                     # MacroPlanView (timeline), RevisionHeatmap (GitHub-style)
└── modals/                    # AddTaskDialog, ExecuteTaskDialog, DailyRitual x2, TemplateLibraryDialog
```

---

## Branchement Supabase (TODO)

### Tables cibles

| Type local | Table Supabase |
|---|---|
| `CalendarEvent` | `organize_events` |
| `BacklogItem` | `organize_backlog` |
| `AutoModeConfig` | `organize_config` (par user) |
| `AppNotification` | `organize_notifications` |

### Hooks a modifier

**`useOrganizeStore.ts`** — chercher les commentaires `// TODO_SUPABASE` :
- `loadState()` → `supabase.from('organize_events').select('*').eq('user_id', userId)`
- `addEvent` → `supabase.from('organize_events').insert(event)`
- `updateEvent` → `supabase.from('organize_events').update(event).eq('id', id)`
- `deleteEvent` → `supabase.from('organize_events').delete().eq('id', id)`

**`data/courses.ts` et `data/series.ts`** — les donnees mock seront remplacees par :
- `supabase.from('courses').select('*')` (table globale partagee)
- `supabase.from('series').select('*').eq('course_id', courseId)`

**`data/userStats.ts`** — les KPI viennent du module Statistiques :
- `supabase.from('user_stats').select('avg_time_per_qcm').eq('user_id', userId).single()`

### Realtime

Pour la collaboration future (plusieurs appareils) :
```ts
supabase
  .channel('organize_events')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'organize_events' }, payload => {
    // update local state
  })
  .subscribe()
```

---

## Decisions techniques

- **Drag & drop** : HTML5 native (`draggable`, `onDragStart`, `onDrop`) pour simplifier. Migrer vers `@dnd-kit` si besoin de touch support.
- **Animations** : CSS Tailwind transitions. Ajouter `motion/react` (voir package.json) pour stagger si besoin.
- **Recherche** : fuzzy maison sur 75 cours. Migrer vers `fuse.js` si les resultats ne sont pas satisfaisants.
- **Dates** : helpers natifs dans `lib/dateUtils.ts`. `date-fns` est dans package.json pour les cas complexes.

---

## Criteres d'acceptance

Voir section 13 du brief produit. Tous les points sont couverts par la maquette.
