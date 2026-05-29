import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => {
        if (typeof document === "undefined") return null;
        const cookies = document.cookie.split("; ");
        const found = cookies.find((c) => c.startsWith(`${key}=`));
        return found ? decodeURIComponent(found.split("=")[1]) : null;
      },
      setItem: (key: string, value: string) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
      },
      removeItem: (key: string) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=; path=/; max-age=0`;
      },
    },
  },
});