import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { useEffect } from "react";
import Switch from "../../Form/Switch/Switch";

const Mode = () => {
  const { themeMode, setThemeMode } = useThemeConfig();
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setThemeMode("dark");
    }
    if (localStorage.getItem("mode") === "dark") {
      setThemeMode("dark");
    } else {
      setThemeMode("light");
    }
  }, []);

  const onChange = (e) => {
    if (e.currentTarget.checked) {
      setThemeMode("dark");
      localStorage.setItem("mode","dark")
    } else {
      setThemeMode("light");
      localStorage.setItem("mode","light")
    }
  };

  return <Switch onChange={onChange} checked={themeMode === "dark"} />;
};

export default Mode;
