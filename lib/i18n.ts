import type { AqiCategoryKey } from "@/lib/types";
import type { UserGroupId } from "@/lib/userGroups";

/**
 * Localization for AirIQ UI chrome plus the plain-English AQI copy (category
 * meaning + action lists). Google localizes the health-recommendation text itself
 * via languageCode; everything else lives here.
 */

export type Language = "en" | "es" | "fr";

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
];

export const DEFAULT_LANGUAGE: Language = "en";

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "es" || value === "fr";
}

/** Maps our app language to Google's languageCode for localized health text. */
export function googleLanguageCode(lang: Language): string {
  return lang; // en/es/fr line up 1:1 with Google's codes
}

type CategoryText = { label: string; meaning: string; actions: string[] };

type Dict = {
  appName: string;
  tagline: string;
  search: {
    title: string;
    placeholder: string;
    button: string;
    helper: string;
    invalid: string;
  };
  banner: {
    showing: string;
    updated: string;
    refresh: string;
    change: string;
    savePrompt: string;
    save: string;
    notNow: string;
    saved: string;
  };
  aqi: {
    sectionTitle: string;
    indexLabel: string;
    dominant: string;
    updated: string;
    categories: Record<AqiCategoryKey, CategoryText>;
    meaningTitle: string;
    actionsTitle: string;
  };
  pollutants: {
    title: string;
    main: string;
    noData: string;
  };
  health: {
    title: string;
    forYou: string;
    forEveryone: string;
    none: string;
  };
  groups: Record<UserGroupId, string>;
  forecast: {
    title: string;
    today: string;
    high: string;
    low: string;
    noData: string;
    weekdays: string[]; // Sun..Sat
  };
  trend: {
    title: string;
    noData: string;
    aqi: string;
  };
  map: {
    title: string;
    layer: string;
    yourLocation: string;
    loading: string;
    unavailable: string;
  };
  nearby: {
    title: string;
    subtitle: string;
    categories: { pharmacy: string; clinic: string; library: string; community: string };
    openNow: string;
    closed: string;
    directions: string;
    noData: string;
  };
  weather: {
    title: string;
    feelsLike: string;
    wind: string;
    visibility: string;
    humidity: string;
    unavailable: string;
  };
  settings: {
    title: string;
    open: string;
    whoLabel: string;
    whoHelp: string;
    languageLabel: string;
    locationLabel: string;
    noLocation: string;
    clearLocation: string;
    resetAll: string;
    resetConfirm: string;
    done: string;
  };
  disclaimer: string;
  wildfire: { title: string; text: string; link: string };
  loading: string;
  errors: {
    title: string;
    retry: string;
    invalid_zip: string;
    no_data: string;
    google_error: string;
    rate_limit: string;
    network: string;
    server: string;
  };
};

const en: Dict = {
  appName: "AirIQ",
  tagline: "Know your air. Breathe easier.",
  search: {
    title: "Check your local air quality",
    placeholder: "Enter ZIP code",
    button: "Check air",
    helper: "Enter a 5-digit US ZIP code.",
    invalid: "Please enter a valid 5-digit US ZIP code.",
  },
  banner: {
    showing: "Showing",
    updated: "Updated",
    refresh: "Refresh",
    change: "Change location",
    savePrompt: "Save this location for next time?",
    save: "Save",
    notNow: "Not now",
    saved: "Saved for next time.",
  },
  aqi: {
    sectionTitle: "Current air quality",
    indexLabel: "Air Quality Index",
    dominant: "Main pollutant",
    updated: "Updated",
    meaningTitle: "What this means",
    actionsTitle: "What you should do now",
    categories: {
      good: {
        label: "Good",
        meaning: "Air quality is good. The air poses little or no risk.",
        actions: ["Enjoy your normal outdoor activities."],
      },
      moderate: {
        label: "Moderate",
        meaning:
          "Air quality is acceptable. There may be a small risk for people who are unusually sensitive to air pollution.",
        actions: [
          "Most people can be active outdoors as usual.",
          "If you're unusually sensitive, watch for symptoms like coughing.",
        ],
      },
      usg: {
        label: "Unhealthy for sensitive groups",
        meaning:
          "Sensitive groups may feel effects. Most people are not likely to be affected.",
        actions: [
          "Sensitive groups: take it easier during long or intense outdoor activity.",
          "Take more breaks and watch for symptoms.",
        ],
      },
      unhealthy: {
        label: "Unhealthy",
        meaning:
          "Some people may feel effects, and sensitive groups may feel more serious effects.",
        actions: [
          "Cut back on long or intense outdoor activity.",
          "Sensitive groups: stay indoors when you can.",
          "Keep windows closed and use clean indoor air if available.",
        ],
      },
      "very-unhealthy": {
        label: "Very unhealthy",
        meaning: "Health alert: the risk is increased for everyone.",
        actions: [
          "Avoid long or intense outdoor activity.",
          "Sensitive groups: stay indoors.",
          "Run an air purifier or use a clean-air room if you can.",
        ],
      },
      hazardous: {
        label: "Hazardous",
        meaning: "Health warning of emergency conditions. Everyone is more likely to be affected.",
        actions: [
          "Stay indoors and keep activity low.",
          "Keep windows and doors closed.",
          "Follow official local guidance and alerts.",
        ],
      },
      unknown: {
        label: "Unknown",
        meaning: "We don't have an air quality reading for this location right now.",
        actions: ["Try refreshing in a little while."],
      },
    },
  },
  pollutants: {
    title: "Pollutant details",
    main: "Main",
    noData: "No pollutant details are available right now.",
  },
  health: {
    title: "Health guidance",
    forYou: "For you",
    forEveryone: "For everyone",
    none: "No specific guidance is available right now.",
  },
  groups: {
    general: "General public",
    children: "Children",
    elderly: "Older adults",
    asthma: "Asthma or lung sensitivity",
    heart: "Heart condition",
    pregnant: "Pregnant",
    athlete: "Athlete or outdoor worker",
  },
  forecast: {
    title: "4-day forecast",
    today: "Today",
    high: "High",
    low: "Low",
    noData: "Forecast is not available right now.",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  trend: {
    title: "Last 24 hours",
    noData: "Recent trend is not available right now.",
    aqi: "AQI",
  },
  map: {
    title: "Map",
    layer: "Air quality layer",
    yourLocation: "Your location",
    loading: "Loading map…",
    unavailable: "Map is unavailable. Add a Maps key to enable it.",
  },
  nearby: {
    title: "Nearby support",
    subtitle: "Indoor places that may offer cleaner air or help.",
    categories: {
      pharmacy: "Pharmacies",
      clinic: "Clinics & hospitals",
      library: "Libraries",
      community: "Community centers",
    },
    openNow: "Open now",
    closed: "Closed",
    directions: "Directions",
    noData: "No nearby places found.",
  },
  weather: {
    title: "Weather context",
    feelsLike: "Feels like",
    wind: "Wind",
    visibility: "Visibility",
    humidity: "Humidity",
    unavailable: "Weather data is unavailable.",
  },
  settings: {
    title: "Settings",
    open: "Settings",
    whoLabel: "Who is this for?",
    whoHelp: "We'll show guidance for this group first.",
    languageLabel: "Language",
    locationLabel: "Saved location",
    noLocation: "No saved location.",
    clearLocation: "Remove saved location",
    resetAll: "Reset all AirIQ data",
    resetConfirm: "This clears your saved location and preferences. Continue?",
    done: "Done",
  },
  disclaimer:
    "AirIQ is for public awareness and planning only — not emergency or medical advice. For health concerns, contact a medical professional.",
  wildfire: {
    title: "Wildfire or smoke nearby?",
    text: "During active wildfire or smoke events, conditions can change fast. Check your official local alerts.",
    link: "Check AirNow.gov",
  },
  loading: "Loading air quality…",
  errors: {
    title: "Something went wrong",
    retry: "Try again",
    invalid_zip: "We couldn't find that ZIP code. Please check it and try again.",
    no_data: "No air quality data is available for this location yet.",
    google_error: "We couldn't load air quality just now. Please try again.",
    rate_limit: "We're getting a lot of requests right now. Please try again in a moment.",
    network: "You appear to be offline. Check your connection and try again.",
    server: "Something went wrong on our end. Please try again.",
  },
};

const es: Dict = {
  appName: "AirIQ",
  tagline: "Conoce tu aire. Respira tranquilo.",
  search: {
    title: "Consulta la calidad del aire en tu zona",
    placeholder: "Ingresa el código postal",
    button: "Consultar aire",
    helper: "Ingresa un código postal de EE. UU. de 5 dígitos.",
    invalid: "Ingresa un código postal de EE. UU. válido de 5 dígitos.",
  },
  banner: {
    showing: "Mostrando",
    updated: "Actualizado",
    refresh: "Actualizar",
    change: "Cambiar ubicación",
    savePrompt: "¿Guardar esta ubicación para la próxima vez?",
    save: "Guardar",
    notNow: "Ahora no",
    saved: "Guardado para la próxima vez.",
  },
  aqi: {
    sectionTitle: "Calidad del aire actual",
    indexLabel: "Índice de calidad del aire",
    dominant: "Contaminante principal",
    updated: "Actualizado",
    meaningTitle: "Qué significa esto",
    actionsTitle: "Qué deberías hacer ahora",
    categories: {
      good: {
        label: "Buena",
        meaning: "La calidad del aire es buena. El aire presenta poco o ningún riesgo.",
        actions: ["Disfruta de tus actividades al aire libre con normalidad."],
      },
      moderate: {
        label: "Moderada",
        meaning:
          "La calidad del aire es aceptable. Puede haber un pequeño riesgo para personas muy sensibles a la contaminación.",
        actions: [
          "La mayoría puede hacer actividad al aire libre como siempre.",
          "Si eres muy sensible, atento a síntomas como la tos.",
        ],
      },
      usg: {
        label: "Insalubre para grupos sensibles",
        meaning:
          "Los grupos sensibles pueden notar efectos. Es poco probable que la mayoría se vea afectada.",
        actions: [
          "Grupos sensibles: tómalo con calma en actividades intensas o prolongadas al aire libre.",
          "Haz más pausas y atento a los síntomas.",
        ],
      },
      unhealthy: {
        label: "Insalubre",
        meaning:
          "Algunas personas pueden notar efectos, y los grupos sensibles pueden notar efectos más serios.",
        actions: [
          "Reduce la actividad intensa o prolongada al aire libre.",
          "Grupos sensibles: quédate en interiores cuando puedas.",
          "Mantén las ventanas cerradas y usa aire limpio en interiores si es posible.",
        ],
      },
      "very-unhealthy": {
        label: "Muy insalubre",
        meaning: "Alerta de salud: el riesgo aumenta para todos.",
        actions: [
          "Evita la actividad intensa o prolongada al aire libre.",
          "Grupos sensibles: quédate en interiores.",
          "Usa un purificador de aire o una habitación con aire limpio si puedes.",
        ],
      },
      hazardous: {
        label: "Peligrosa",
        meaning:
          "Advertencia de salud por condiciones de emergencia. Es más probable que todos se vean afectados.",
        actions: [
          "Quédate en interiores y reduce la actividad.",
          "Mantén ventanas y puertas cerradas.",
          "Sigue las indicaciones y alertas oficiales locales.",
        ],
      },
      unknown: {
        label: "Desconocida",
        meaning: "No tenemos una lectura de calidad del aire para esta ubicación ahora mismo.",
        actions: ["Intenta actualizar en un rato."],
      },
    },
  },
  pollutants: {
    title: "Detalles de contaminantes",
    main: "Principal",
    noData: "No hay detalles de contaminantes disponibles ahora.",
  },
  health: {
    title: "Guía de salud",
    forYou: "Para ti",
    forEveryone: "Para todos",
    none: "No hay una guía específica disponible ahora.",
  },
  groups: {
    general: "Público general",
    children: "Niños",
    elderly: "Adultos mayores",
    asthma: "Asma o sensibilidad pulmonar",
    heart: "Afección cardíaca",
    pregnant: "Embarazo",
    athlete: "Atleta o trabajo al aire libre",
  },
  forecast: {
    title: "Pronóstico de 4 días",
    today: "Hoy",
    high: "Máx",
    low: "Mín",
    noData: "El pronóstico no está disponible ahora.",
    weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  },
  trend: {
    title: "Últimas 24 horas",
    noData: "La tendencia reciente no está disponible ahora.",
    aqi: "ICA",
  },
  map: {
    title: "Mapa",
    layer: "Capa de calidad del aire",
    yourLocation: "Tu ubicación",
    loading: "Cargando mapa…",
    unavailable: "El mapa no está disponible. Agrega una clave de Maps para activarlo.",
  },
  nearby: {
    title: "Apoyo cercano",
    subtitle: "Lugares interiores que pueden ofrecer aire más limpio o ayuda.",
    categories: {
      pharmacy: "Farmacias",
      clinic: "Clínicas y hospitales",
      library: "Bibliotecas",
      community: "Centros comunitarios",
    },
    openNow: "Abierto ahora",
    closed: "Cerrado",
    directions: "Cómo llegar",
    noData: "No se encontraron lugares cercanos.",
  },
  weather: {
    title: "Contexto del clima",
    feelsLike: "Sensación",
    wind: "Viento",
    visibility: "Visibilidad",
    humidity: "Humedad",
    unavailable: "Los datos del clima no están disponibles.",
  },
  settings: {
    title: "Ajustes",
    open: "Ajustes",
    whoLabel: "¿Para quién es esto?",
    whoHelp: "Mostraremos primero la guía para este grupo.",
    languageLabel: "Idioma",
    locationLabel: "Ubicación guardada",
    noLocation: "Sin ubicación guardada.",
    clearLocation: "Eliminar ubicación guardada",
    resetAll: "Restablecer todos los datos de AirIQ",
    resetConfirm: "Esto borra tu ubicación guardada y tus preferencias. ¿Continuar?",
    done: "Listo",
  },
  disclaimer:
    "AirIQ es solo para concientización y planificación pública, no es asesoramiento médico ni de emergencia. Para temas de salud, consulta a un profesional médico.",
  wildfire: {
    title: "¿Incendios o humo cerca?",
    text: "Durante incendios o episodios de humo activos, las condiciones pueden cambiar rápido. Consulta tus alertas oficiales locales.",
    link: "Consulta AirNow.gov",
  },
  loading: "Cargando calidad del aire…",
  errors: {
    title: "Algo salió mal",
    retry: "Reintentar",
    invalid_zip: "No encontramos ese código postal. Verifícalo e inténtalo de nuevo.",
    no_data: "Aún no hay datos de calidad del aire para esta ubicación.",
    google_error: "No pudimos cargar la calidad del aire ahora. Inténtalo de nuevo.",
    rate_limit: "Estamos recibiendo muchas solicitudes. Inténtalo de nuevo en un momento.",
    network: "Parece que estás sin conexión. Revisa tu conexión e inténtalo de nuevo.",
    server: "Algo salió mal de nuestro lado. Inténtalo de nuevo.",
  },
};

const fr: Dict = {
  appName: "AirIQ",
  tagline: "Connaissez votre air. Respirez mieux.",
  search: {
    title: "Vérifiez la qualité de l'air près de chez vous",
    placeholder: "Saisir le code postal",
    button: "Vérifier l'air",
    helper: "Saisissez un code postal américain à 5 chiffres.",
    invalid: "Veuillez saisir un code postal américain valide à 5 chiffres.",
  },
  banner: {
    showing: "Affichage",
    updated: "Mis à jour",
    refresh: "Actualiser",
    change: "Changer de lieu",
    savePrompt: "Enregistrer ce lieu pour la prochaine fois ?",
    save: "Enregistrer",
    notNow: "Pas maintenant",
    saved: "Enregistré pour la prochaine fois.",
  },
  aqi: {
    sectionTitle: "Qualité de l'air actuelle",
    indexLabel: "Indice de qualité de l'air",
    dominant: "Polluant principal",
    updated: "Mis à jour",
    meaningTitle: "Ce que cela signifie",
    actionsTitle: "Ce que vous devriez faire maintenant",
    categories: {
      good: {
        label: "Bonne",
        meaning: "La qualité de l'air est bonne. L'air présente peu ou pas de risque.",
        actions: ["Profitez normalement de vos activités en plein air."],
      },
      moderate: {
        label: "Moyenne",
        meaning:
          "La qualité de l'air est acceptable. Un faible risque existe pour les personnes très sensibles à la pollution.",
        actions: [
          "La plupart des gens peuvent rester actifs dehors comme d'habitude.",
          "Si vous êtes très sensible, surveillez les symptômes comme la toux.",
        ],
      },
      usg: {
        label: "Mauvaise pour les groupes sensibles",
        meaning:
          "Les groupes sensibles peuvent ressentir des effets. La plupart des gens ne seront probablement pas affectés.",
        actions: [
          "Groupes sensibles : allez-y doucement lors d'efforts longs ou intenses en plein air.",
          "Faites plus de pauses et surveillez les symptômes.",
        ],
      },
      unhealthy: {
        label: "Mauvaise",
        meaning:
          "Certaines personnes peuvent ressentir des effets, et les groupes sensibles des effets plus sérieux.",
        actions: [
          "Réduisez les efforts longs ou intenses en plein air.",
          "Groupes sensibles : restez à l'intérieur si possible.",
          "Gardez les fenêtres fermées et utilisez un air intérieur propre si possible.",
        ],
      },
      "very-unhealthy": {
        label: "Très mauvaise",
        meaning: "Alerte santé : le risque augmente pour tout le monde.",
        actions: [
          "Évitez les efforts longs ou intenses en plein air.",
          "Groupes sensibles : restez à l'intérieur.",
          "Utilisez un purificateur d'air ou une pièce à air propre si possible.",
        ],
      },
      hazardous: {
        label: "Dangereuse",
        meaning:
          "Avertissement sanitaire de conditions d'urgence. Tout le monde risque davantage d'être affecté.",
        actions: [
          "Restez à l'intérieur et limitez l'activité.",
          "Gardez les fenêtres et les portes fermées.",
          "Suivez les consignes et alertes officielles locales.",
        ],
      },
      unknown: {
        label: "Inconnue",
        meaning: "Nous n'avons pas de mesure de la qualité de l'air pour ce lieu pour le moment.",
        actions: ["Réessayez d'actualiser un peu plus tard."],
      },
    },
  },
  pollutants: {
    title: "Détails des polluants",
    main: "Principal",
    noData: "Aucun détail sur les polluants n'est disponible pour le moment.",
  },
  health: {
    title: "Conseils santé",
    forYou: "Pour vous",
    forEveryone: "Pour tous",
    none: "Aucun conseil spécifique n'est disponible pour le moment.",
  },
  groups: {
    general: "Grand public",
    children: "Enfants",
    elderly: "Personnes âgées",
    asthma: "Asthme ou sensibilité pulmonaire",
    heart: "Problème cardiaque",
    pregnant: "Grossesse",
    athlete: "Sportif ou travail en extérieur",
  },
  forecast: {
    title: "Prévisions sur 4 jours",
    today: "Aujourd'hui",
    high: "Max",
    low: "Min",
    noData: "Les prévisions ne sont pas disponibles pour le moment.",
    weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  },
  trend: {
    title: "Dernières 24 heures",
    noData: "La tendance récente n'est pas disponible pour le moment.",
    aqi: "IQA",
  },
  map: {
    title: "Carte",
    layer: "Couche qualité de l'air",
    yourLocation: "Votre position",
    loading: "Chargement de la carte…",
    unavailable: "La carte est indisponible. Ajoutez une clé Maps pour l'activer.",
  },
  nearby: {
    title: "Ressources à proximité",
    subtitle: "Lieux intérieurs offrant un air plus propre ou de l'aide.",
    categories: {
      pharmacy: "Pharmacies",
      clinic: "Cliniques et hôpitaux",
      library: "Bibliothèques",
      community: "Centres communautaires",
    },
    openNow: "Ouvert",
    closed: "Fermé",
    directions: "Itinéraire",
    noData: "Aucun lieu trouvé à proximité.",
  },
  weather: {
    title: "Contexte météo",
    feelsLike: "Ressenti",
    wind: "Vent",
    visibility: "Visibilité",
    humidity: "Humidité",
    unavailable: "Les données météo sont indisponibles.",
  },
  settings: {
    title: "Paramètres",
    open: "Paramètres",
    whoLabel: "Pour qui est-ce ?",
    whoHelp: "Nous afficherons d'abord les conseils pour ce groupe.",
    languageLabel: "Langue",
    locationLabel: "Lieu enregistré",
    noLocation: "Aucun lieu enregistré.",
    clearLocation: "Supprimer le lieu enregistré",
    resetAll: "Réinitialiser toutes les données AirIQ",
    resetConfirm: "Cela efface votre lieu enregistré et vos préférences. Continuer ?",
    done: "Terminé",
  },
  disclaimer:
    "AirIQ sert uniquement à la sensibilisation et à la planification du public, ce n'est pas un avis médical ou d'urgence. Pour toute question de santé, consultez un professionnel de santé.",
  wildfire: {
    title: "Incendie ou fumée à proximité ?",
    text: "Lors d'incendies ou d'épisodes de fumée actifs, les conditions peuvent changer vite. Consultez vos alertes officielles locales.",
    link: "Consulter AirNow.gov",
  },
  loading: "Chargement de la qualité de l'air…",
  errors: {
    title: "Une erreur est survenue",
    retry: "Réessayer",
    invalid_zip: "Code postal introuvable. Vérifiez-le et réessayez.",
    no_data: "Aucune donnée de qualité de l'air n'est disponible pour ce lieu.",
    google_error: "Impossible de charger la qualité de l'air pour l'instant. Réessayez.",
    rate_limit: "Nous recevons beaucoup de demandes en ce moment. Réessayez dans un instant.",
    network: "Vous semblez hors ligne. Vérifiez votre connexion et réessayez.",
    server: "Une erreur est survenue de notre côté. Réessayez.",
  },
};

const DICTS: Record<Language, Dict> = { en, es, fr };

export function getDict(lang: Language): Dict {
  return DICTS[lang] ?? en;
}

export type { Dict };
