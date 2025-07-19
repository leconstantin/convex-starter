'use client';

import { MonitorDotIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <ToggleGroup onValueChange={setTheme} size="sm" type="single" value={theme}>
      <ToggleGroupItem
        aria-label="Light"
        className="cursor-pointer"
        value="light"
      >
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        aria-label="Dark"
        className="cursor-pointer"
        value="dark"
      >
        <MoonIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        aria-label="System"
        className="cursor-pointer"
        value="system"
      >
        <MonitorDotIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
