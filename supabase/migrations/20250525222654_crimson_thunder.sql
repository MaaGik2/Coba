/*
  # Création des tables pour la gestion des composants électroniques

  1. Nouvelles Tables
    - `categories`
      - `id` (uuid, clé primaire)
      - `name` (text, nom de la catégorie)
      - `created_at` (timestamp)
    
    - `components`
      - `id` (uuid, clé primaire)
      - `name` (text, nom du composant)
      - `category_id` (uuid, référence vers categories)
      - `quantity` (integer, quantité en stock)
      - `row` (integer, rangée dans le casier)
      - `column` (integer, colonne dans le casier)
      - `led_color_r` (integer, composante rouge 0-255)
      - `led_color_g` (integer, composante verte 0-255)
      - `led_color_b` (integer, composante bleue 0-255)
      - `properties` (jsonb, propriétés personnalisables)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - RLS activé sur les deux tables
    - Politiques pour lecture/écriture pour les utilisateurs authentifiés
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
  row integer NOT NULL,
  column integer NOT NULL,
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