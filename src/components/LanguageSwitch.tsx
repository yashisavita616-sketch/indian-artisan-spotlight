import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5 text-sm font-medium"
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
      <span className="sm:hidden">{language === 'en' ? 'हि' : 'En'}</span>
    </Button>
  );
}
