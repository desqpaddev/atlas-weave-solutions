import { Globe, ChevronDown } from "lucide-react";

const LANGS = [
  { code: "", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "zh-CN", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "tr", label: "Turkish" },
];

function setGoogleTranslateCookie(lang: string) {
  const value = lang ? `/en/${lang}` : "/en/en";
  // Cookie must be set on the current host and on the parent domain for the widget to pick it up
  const host = window.location.hostname;
  const parts = host.split(".");
  const root = parts.length > 1 ? "." + parts.slice(-2).join(".") : host;
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `googtrans=${value};expires=${expires};path=/`;
  document.cookie = `googtrans=${value};expires=${expires};path=/;domain=${host}`;
  document.cookie = `googtrans=${value};expires=${expires};path=/;domain=${root}`;
}

export function GoogleTranslate() {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGoogleTranslateCookie(e.target.value);
    window.location.reload();
  };

  return (
    <div className="relative flex items-center gap-1 notranslate">
      <Globe className="h-3 w-3" />
      <select
        onChange={onChange}
        defaultValue=""
        className="bg-transparent text-primary-foreground text-xs hover:underline focus:outline-none cursor-pointer appearance-none pr-4"
        aria-label="Select language"
      >
        {LANGS.map((l) => (
          <option key={l.code || "en"} value={l.code} className="text-foreground">
            {l.label}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3 w-3 -ml-4 pointer-events-none" />
    </div>
  );
}
