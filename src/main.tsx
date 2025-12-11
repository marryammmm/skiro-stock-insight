import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Auto-clear stale auth/session keys on localhost to prevent stuck login/register
try {
	const isLocal = typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.host);
	const alreadyCleaned = typeof sessionStorage !== "undefined" && sessionStorage.getItem("skiro:autoCleaned") === "true";

	if (isLocal && !alreadyCleaned) {
		const keysToRemove: string[] = [];
		const lower = (s: string) => s.toLowerCase();
		// Collect Supabase-related keys
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!key) continue;
			const k = lower(key);
			if (k.includes("supabase") || key.startsWith("sb-") || key === "supabase.auth.token") {
				keysToRemove.push(key);
			}
		}
		// Collect security_* keys
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith("security_")) {
				keysToRemove.push(key);
			}
		}
		// De-duplicate and remove
		Array.from(new Set(keysToRemove)).forEach((k) => {
			try { localStorage.removeItem(k); } catch {}
		});
		sessionStorage.setItem("skiro:autoCleaned", "true");
		console.log("🧹 SKIRO: Auto-cleared local Supabase/session keys (localhost)");
	}
} catch (e) {
	console.warn("SKIRO auto-clean skipped:", e);
}

createRoot(document.getElementById("root")!).render(<App />);
