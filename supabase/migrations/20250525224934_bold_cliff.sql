/*
  # Ajout des sous-catégories et valeurs de composants

  1. Modifications
    - Ajout de la colonne parent_id dans la table categories pour les sous-catégories
    - Ajout de la colonne value dans la table components pour stocker les valeurs
    - Ajout de la colonne unit dans la table components pour l'unité de mesure

  2. Sécurité
    - Maintien des politiques RLS existantes
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN parent_id uuid REFERENCES categories(id);
  END IF;
END $$;

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'components' AND column_name = 'value'
  ) THEN
    ALTER TABLE components ADD COLUMN value numeric;
    ALTER TABLE components ADD COLUMN unit text;
  END IF;
END $$;