// ────────────────────────── Espèces ──────────────────────────
export const SPECIES_LABELS = {
    cat: 'Chat',
    dog: 'Chien',
    rabbit: 'Lapin',
    bird: 'Oiseau',
    hamster: 'Hamster',
    other: 'Autre'
};

// Icones Lucide par espèce
// import { Cat, Dog, Rabbit, Bird, Squirrel, PawPrint } from 'lucide-react'
export const SPECIES_ICON = {
    cat: 'Cat',
    dog: 'Dog',
    rabbit: 'Rabbit',
    bird: 'Bird',
    hamster: 'Squirrel',
    other: 'PawPrint'
};

export const SPECIES_BADGE_CLASS = {
    cat: 'badge badge-cat',
    dog: 'badge badge-dog',
    rabbit: 'badge badge-rabbit',
    bird: 'badge badge-bird',
    hamster: 'badge badge-hamster',
    other: 'badge badge-other'
};

// ────────────────────────── Genre ──────────────────────────
export const GENDER_LABELS = {
    male: 'Mâle',
    female: 'Femelle',
    unknown: 'Non renseigné'
};

// ────────────────────────── Humeur ──────────────────────────
export const MOOD_LABELS = {
    happy: 'Joyeux',
    calm: 'Calme',
    tired: 'Fatigué',
    stressed:'Stressé',
    sick: 'Malade',
    unknown: 'Non renseigné'
};

// Couleur par humeur
export const MOOD_COLOR = {
    happy: '#5A9B6B',
    calm: '#5B8DB8',
    tired: '#9B8EC4',
    stressed: '#E8B84B',
    sick: '#C0544B',
    unknown: '#9C8F89'
};

// Icones Lucide par humeur
// import { Smile, Meh, BatteryLow, Zap, Thermometer, HelpCircle } from 'lucide-react'
export const MOOD_ICON = {
    happy: 'Smile',
    calm: 'Meh',
    tired: 'BatteryLow',
    stressed: 'Zap',
    sick: 'Thermometer',
    unknown: 'HelpCircle'
};

// ────────────────────────── Appétit ──────────────────────────
export const APPETITE_LABELS = {
    normal: 'Normal',
    increased: 'Augmenté',
    decreased: 'Diminué',
    refused: 'Refusé'
};

// ────────────────────────── Activités ──────────────────────────
export const ACTIVITY_LABELS = {
    walk: 'Promenade',
    run: 'Course',
    play: 'Jeu',
    training: 'Dressage',
    swimming: 'Natation',
    rest: 'Repos',
    outdoor: 'Sortie libre',
    exploration: 'Exploration',
    grooming: 'Toilettage',
    flight: 'Vol libre',
    wheel: 'Roue'
};

// Icones Lucide par activité
// import { Footprints, Zap, Gamepad2, Trophy, Waves, Moon, TreePine, Compass, Scissors, Wind, RotateCw } from 'lucide-react'
export const ACTIVITY_ICON = {
    walk: 'Footprints',
    run: 'Zap',
    play: 'Gamepad2',
    training: 'Trophy',
    swimming: 'Waves',
    rest: 'Moon',
    outdoor: 'TreePine',
    exploration: 'Compass',
    grooming: 'Scissors',
    flight: 'Wind',
    wheel: 'RotateCw'
};

// ────────────────────────── Types de rappels ──────────────────────────
export const REMINDER_TYPE_LABELS = {
    vaccine: 'Vaccination',
    vet: 'Vétérinaire',
    medication: 'Médicament',
    grooming: 'Toilettage',
    deworming: 'Vermifuge',
    custom: 'Personnalisé'
};

// Icones Lucide par type de rappel
// import { Syringe, Stethoscope, Pill, Scissors, Shield, Calendar } from 'lucide-react'
export const REMINDER_TYPE_ICON = {
    vaccine: 'Syringe',
    vet: 'Stethoscope',
    medication: 'Pill',
    grooming: 'Scissors',
    deworming: 'Shield',
    custom: 'Calendar'
};

// Couleur par statut de rappel
export const REMINDER_STATUS_COLOR = {
    pending: '#E8B84B',
    done: '#5A9B6B',
    snoozed: '#9C8F89'
};

export const REMINDER_STATUS_LABELS = {
    pending: 'En attente',
    done: 'Fait',
    snoozed: 'Reporté'
};

// ────────────────────────── Types de health records ──────────────────────────
export const HEALTH_TYPE_LABELS = {
    weight: 'Pesée',
    vaccine: 'Vaccination',
    vet_visit: 'Visite vétérinaire',
    medication: 'Médicament',
    symptom: 'Symptôme',
    grooming: 'Toilettage',
    deworming: 'Vermifuge',
    note: 'Note'
};

// Icones Lucide par type health record
// import { Scale, Syringe, Stethoscope, Pill, AlertCircle, Scissors, Shield, FileText } from 'lucide-react'
export const HEALTH_TYPE_ICON = {
    weight: 'Scale',
    vaccine: 'Syringe',
    vet_visit: 'Stethoscope',
    medication: 'Pill',
    symptom: 'AlertCircle',
    grooming: 'Scissors',
    deworming: 'Shield',
    note: 'FileText'
};

// ────────────────────────── Activités par espèce ──────────────────────────
export const SPECIES_ACTIVITIES = {
    cat: ['play', 'outdoor', 'grooming', 'rest', 'exploration'],
    dog: ['walk', 'run', 'play', 'training', 'swimming', 'rest'],
    rabbit: ['play', 'outdoor', 'rest'],
    bird: ['play', 'training', 'flight', 'rest'],
    hamster: ['wheel', 'play', 'exploration', 'rest'],
    other: ['play', 'rest', 'outdoor']
};