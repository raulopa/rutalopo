import { ca } from "./ca";
import { es } from "./es";
import { en } from "./en";

export interface RouteTranslations {
  name: string;
  description: string;
  patrimony: string; // BIC / Patrimonio
  difficulty: string;
}

export interface RouteDataMultilingual {
  id: string;
  distance: number;
  elevation: number;
  difficultyKey: 'easy' | 'moderate' | 'hard';
  picIndicator: string; // Heritage indicator like 'BIC' or 'Patrimoni'
  duration: string;
  gpxPoints: { lat: number; lon: number; ele: number }[];
  langs: {
    ca: RouteTranslations; // Valencià
    es: RouteTranslations; // Castellano
    en: RouteTranslations; // English
  };
}

export const routesList: RouteDataMultilingual[] = [
];

export const appTranslations = {
  ca,
  es,
  en
};
