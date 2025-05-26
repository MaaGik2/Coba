-- Création de la table des types de composants
CREATE TABLE public.type_composant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    libelle TEXT NOT NULL UNIQUE
);

-- Création de la table des emplacements
CREATE TABLE public.emplacement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL
);

-- Création de la table des fournisseurs
CREATE TABLE public.fournisseur (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    site_web TEXT,
    email TEXT,
    telephone TEXT
);

-- Création de la table des composants
CREATE TABLE public.composant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    description TEXT,
    valeur TEXT,
    boitier TEXT,
    quantite_en_stock INTEGER DEFAULT 0,
    seuil_alerte INTEGER DEFAULT 0,
    type_id UUID REFERENCES public.type_composant(id) ON DELETE SET NULL,
    emplacement_id UUID REFERENCES public.emplacement(id) ON DELETE SET NULL
);

-- Création de la table des commandes
CREATE TABLE public.commande (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_commande DATE DEFAULT current_date,
    statut TEXT DEFAULT 'en attente',
    fournisseur_id UUID REFERENCES public.fournisseur(id) ON DELETE SET NULL
);

-- Création de la table des lignes de commande
CREATE TABLE public.ligne_commande (
    commande_id UUID REFERENCES public.commande(id) ON DELETE CASCADE,
    composant_id UUID REFERENCES public.composant(id) ON DELETE CASCADE,
    quantite_commandee INTEGER NOT NULL,
    prix_unitaire NUMERIC(10, 2),
    PRIMARY KEY (commande_id, composant_id)
);
