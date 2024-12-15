import { useTheme } from "@/contexts/ThemeContext";
export default function RecommendedPlugins() {
  const { theme } = useTheme();
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>推荐插件</h1>
      <p style={{ color: theme.text.secondary }}>
        这里是我们为您精选的推荐插件列表。
      </p>
    </div>
  );
}
