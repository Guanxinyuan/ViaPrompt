import { useContext, useEffect, useState } from 'react';
import useColorMode from '@/hooks/useColorMode';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle({ colorModeSetter }) {
  const [colorMode, setColorMode] = useColorMode()
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, [])

  const switchColorMode = () => {
    setColorMode(colorMode == "light" ? "dark" : "light")
    colorModeSetter(colorMode == "light" ? "dark" : "light")
  }

  return (
    <div
      className="relative inline-block w-10 h-5 rounded-full bg-zinc-800 dark:bg-white flex flex-row"
      onClick={switchColorMode}
    >

      {
        isInitialized && colorMode == 'light' &&
        <SunIcon className={`dark-mode-icon bg-white border-zinc-800 translate-x-full`} />
      }
      {
        isInitialized && colorMode == 'dark' &&
        <MoonIcon className={`dark-mode-icon bg-zinc-800 border-white `} />
      }
    </div>
  );
}
