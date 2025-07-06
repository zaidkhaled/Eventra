'use client';

import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n: i18nextInstance } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      i18nextInstance.changeLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18nextInstance.language === 'en' ? 'ar' : 'en';
    i18nextInstance.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  if (!mounted) return null;

  return (
    <Button onClick={toggleLanguage} ml={2}>
      {i18n.language === 'en' ? '🇸🇦 عربي' : '🇬🇧 English'}
    </Button>
  );
}
