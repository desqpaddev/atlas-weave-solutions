import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const LANGS = [
  { code: "en", label: "English" },
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

function readCurrentLang(): string {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match) return "en";
  const val = decodeURIComponent(match[1]); // e.g. /en/fr
  const parts = val.split("/");
  return parts[2] || "en";
}

function setGoogleTranslateCookie(lang: string) {
  const value = lang && lang !== "en" ? `/en/${lang}` : "";
  const host = window.location.hostname;
  const parts = host.split(".");
  const root = parts.length > 1 ? "." + parts.slice(-2).join(".") : host;
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";

  if (!value) {
    // Clear cookie on every scope
    ["/", "/;domain=" + host, "/;domain=" + root].forEach((p) => {
      document.cookie = `googtrans=;expires=${past};path=${p}`;
    });
    return;
  }
  document.cookie = `googtrans=${value};expires=${expires};path=/`;
  document.cookie = `googtrans=${value};expires=${expires};path=/;domain=${host}`;
  document.cookie = `googtrans=${value};expires=${expires};path=/;domain=${root}`;
}

export function GoogleTranslate() {
  const [current, setCurrent] = useState<string>("en");

  useEffect(() => {
    setCurrent(readCurrentLang());
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setGoogleTranslateCookie(lang);

    // Try to use the live Google combo if present (no reload needed)
    const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (combo) {
      combo.value = lang === "en" ? "" : lang;
      combo.dispatchEvent(new Event("change"));
      // Some pages still need a reload to fully apply
      setTimeout(() => window.location.reload(), 50);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative flex items-center gap-1 notranslate">
      <Globe className="h-3 w-3" />
      <select
        onChange={onChange}
        value={current}
        className="bg-transparent text-primary-foreground text-xs hover:underline focus:outline-none cursor-pointer appearance-none pr-4"
        aria-label="Select language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="text-foreground">
            {l.label}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3 w-3 -ml-4 pointer-events-none" />
    </div>
  );
}
