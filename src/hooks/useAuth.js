import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Sessão do Supabase Auth para o painel admin.
 * Retorna { user, loading, entrar, sair }.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function entrar(email, senha) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) throw error;
  }

  async function sair() {
    await supabase.auth.signOut();
  }

  return { user, loading, entrar, sair };
}
