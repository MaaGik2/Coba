# Coba - Gestionnaire de Composants Électroniques

Coba est une application web moderne pour gérer votre inventaire de composants électroniques. Elle permet de suivre vos composants, leurs emplacements, et de les organiser par catégories.

## 🚀 Fonctionnalités

- 🔍 Recherche de composants
- 📦 Gestion des catégories avec support des sous-catégories
- 🎨 Personnalisation des couleurs LED pour chaque composant
- 📊 Suivi des quantités et des emplacements
- 🔐 Authentification sécurisée
- 🌙 Interface sombre moderne

## 🛠️ Technologies Utilisées

- React + TypeScript
- Tailwind CSS
- Supabase (Backend & Authentification)
- Vite

## 📦 Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/coba.git
cd coba
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. Lancez l'application en mode développement :
```bash
npm run dev
```

## 🏗️ Structure du Projet

```
src/
├── components/         # Composants réutilisables
│   ├── layout/        # Composants de mise en page
│   ├── modals/        # Modales
│   └── ui/            # Composants UI de base
├── features/          # Fonctionnalités principales
│   ├── components/    # Gestion des composants
│   └── categories/    # Gestion des catégories
├── hooks/             # Hooks personnalisés
├── lib/              # Utilitaires et configurations
├── repositories/     # Couche d'accès aux données
└── types/            # Types TypeScript
```

## 🔧 Configuration

### Base de données

L'application utilise Supabase comme backend. Vous devez créer les tables suivantes :

#### Table `components`
- `id` (uuid, primary key)
- `name` (text)
- `category_id` (uuid, foreign key)
- `quantity` (integer)
- `grid_row` (integer)
- `grid_column` (integer)
- `led_color_r` (integer)
- `led_color_g` (integer)
- `led_color_b` (integer)
- `properties` (jsonb)
- `value` (float)
- `unit` (text)

#### Table `categories`
- `id` (uuid, primary key)
- `name` (text)
- `parent_id` (uuid, foreign key, nullable)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- Votre Nom - Développement initial

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Vite](https://vitejs.dev/) 