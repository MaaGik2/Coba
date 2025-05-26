/*
  # Schéma pour la gestion des composants électroniques

  1. Tables
    - `categories`: Stockage des catégories de composants
    - `components`: Stockage des composants avec leurs propriétés

  2. Sécurité
    - Activation RLS sur les deux tables
    - Politiques pour les utilisateurs authentifiés

  3. Données initiales
    - Insertion des catégories par défaut
*/

-- Création de la table des catégories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Création de la table des composants
CREATE TABLE components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id),
  quantity integer DEFAULT 0,
  grid_row integer NOT NULL,
  grid_column integer NOT NULL,
  led_color_r integer DEFAULT 0,
  led_color_g integer DEFAULT 0,
  led_color_b integer DEFAULT 0,
  properties jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activation de la sécurité RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Politiques pour les catégories
CREATE POLICY "Permettre la lecture des catégories aux utilisateurs authentifiés"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permettre la modification des catégories aux utilisateurs authentifiés"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour les composants
CREATE POLICY "Permettre la lecture des composants aux utilisateurs authentifiés"
  ON components FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permettre la modification des composants aux utilisateurs authentifiés"
  ON components FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertion des catégories par défaut
INSERT INTO categories (name) VALUES
  ('Résistances'),
  ('Condensateurs'),
  ('Transistors'),
  ('CI');