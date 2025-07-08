import React from 'react';
import { Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface FontToggleProps {
  fontFamily: 'default' | 'openDyslexic';
  onFontChange: (font: 'default' | 'openDyslexic') => void;
  className?: string;
}

const FontToggle: React.FC<FontToggleProps> = ({ 
  fontFamily, 
  onFontChange,
  className
}) => {
  const { t } = useTranslation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("rounded-md flex items-center gap-2", className)}
          aria-label={fontFamily === 'openDyslexic' ? t('fontToggle.dyslexiaFontOn') : t('fontToggle.dyslexiaFontOff')}
          title={fontFamily === 'openDyslexic' ? t('fontToggle.dyslexiaFontOn') : t('fontToggle.dyslexiaFontOff')}
        >
          <Type size={16} />
          <span>{fontFamily === 'openDyslexic' ? t('fontToggle.dyslexiaFontOn') : t('fontToggle.dyslexiaFontOff')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('fontToggle.fontOptions')}</DropdownMenuLabel>
        <DropdownMenuItem 
          className={fontFamily === 'default' ? 'bg-accent' : ''}
          onClick={() => onFontChange('default')}
        >
          {t('fontToggle.defaultFont')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={fontFamily === 'openDyslexic' ? 'bg-accent' : ''}
          onClick={() => onFontChange('openDyslexic')}
          style={{ fontFamily: 'OpenDyslexic, sans-serif' }}
        >
          {t('fontToggle.openDyslexicFont')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontToggle; 