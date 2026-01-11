# 🚀 Slate - Plateforme Collaborative Intégrée

**Slate** est une solution complète de gestion de productivité conçue pour les équipes modernes. Elle regroupe la gestion de tâches complexes, la prise de notes stratégiques et une expérience de communication fluide inspirée des meilleurs outils du marché.

---

## ✨ Fonctionnalités Majeures

### 💬 Messagerie "Contextuelle"
- **Floating Chat Heads :** Discutez sans quitter votre travail grâce aux bulles de discussion flottantes et réduisibles (style Facebook).
- **Gestion de Groupes :** Création intuitive de discussions privées ou de groupes de projets avec sélection multiple d'utilisateurs.
- **Synchronisation en Temps Réel :** Intégration de Socket.io pour une réception instantanée des messages.

### 📅 Gestion du Temps & Tâches
- **Tableau de Bord des Tâches :** Organisation visuelle des tâches par statut (À faire, En cours, Terminé).
- **Assignations Multiples :** Possibilité d'assigner plusieurs collaborateurs sur une seule mission.
- **Vue Calendrier :** Agenda interactif pour la gestion des rendez-vous professionnels et personnels.

### 📝 Notes & Documents
- **Organisation par Projet :** Liez vos notes à vos tâches pour garder tout le contexte au même endroit.

---

## 🛠 Stack Technique



**Frontend :**
- React 18 (TypeScript)
- Material UI (MUI) pour un design "Slate Premium"
- React Router 6 (Routes protégées et imbriquées)
- Axios (Client API)

**Backend :**
- NestJS (Architecture modulaire)
- TypeORM & PostgreSQL
- Socket.io (Communication bi-directionnelle)
- Swagger (Documentation API automatique)

---

## 🚀 Installation & Lancement

### 1. Cloner le projet
```bash
git clone https://github.com/mohamed-tahiri/My-Note
cd slate-app
```

### 2. Configuration du Backend
```bash
cd backend
pnpm install

pnpm run start:dev
```

### 3. Configuration du Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

---
## 📂 Architecture des Dossiers
```text
├── backend
│   └── src
│       ├── modules
│       │   ├── auth          # Sécurité JWT
│       │   ├── chat          # Logique des salons et messages
│       │   ├── appointments  # Gestion du calendrier
│       │   └── tasks         # CRUD tâches et assignations
├── frontend
│   └── src
│       ├── components
│       │   ├── chat          # Fenêtres flottantes, Modals
│       │   ├── calendar      # Vues FullCalendar
│       │   └── tasks         # Grilles et formulaires
│       ├── api               # Services Axios
│       └── pages             # Vues principales

```

---
## 🎨 Design & UX
L'application utilise une palette de couleurs Slate (Slate 500 à 900) pour une interface sombre et reposante, combinée à des accents Bleu Royal pour les actions principales. Les transitions sont gérées via Framer Motion et MUI Transitions pour une sensation de fluidité maximale.

---
## 🤝 Contribution
1.Forkez le projet

2.Créez votre branche de fonctionnalité (git checkout -b feature/AmazingFeature)

3.Commitez vos changements (git commit -m 'Add some AmazingFeature')

4.Pushez la branche (git push origin feature/AmazingFeature)

5.Ouvrez une Pull Request

---
## ⭐️ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile sur GitHub !

---
## 🤝 Contact

Mohamed TAHIRI - mhdtahiri01@gmail.com - [GitHub](https://github.com/mohamed-tahiri) - [Portfolio](https://mhdthr.vercel.app/)