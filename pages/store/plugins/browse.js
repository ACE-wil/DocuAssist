import { useTheme } from "@/contexts/ThemeContext";
export default function BrowsePlugins() {
  const { theme } = useTheme();
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>浏览全部插件</h1>
      <p style={{ color: theme.text.secondary }}>在这里浏览所有可用的插件。</p>
    </div>
  );
}
