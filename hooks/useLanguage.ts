"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/i18n";
import { getLanguage, setLanguage as persistLanguage } from "@/lib/storage";

/** Persisted UI language. Starts at the default to keep SSR/CSR markup in sync. */
export function useLanguage() {
  const [language, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    persistLanguage(lang);
  };

  return { language, setLanguage };
}
