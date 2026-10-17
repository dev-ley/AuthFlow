
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
}

const API_URL = 'http://localhost:3000/api';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.status === 401 || response.status === 403) {
        router.replace('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Não foi possível carregar o teu perfil.');
      }

      const profile: User = await response.json();
      setUser(profile);
    } catch {
      setError(
        'Não foi possível ligar ao servidor. Confirma se o backend está a funcionar.',
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleLogout() {
    setLoggingOut(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Não foi possível terminar a sessão.');
      }

      setUser(null);
      router.replace('/');
    } catch {
      setError(
        'Não foi possível terminar a sessão. Verifica se o backend está a funcionar.',
      );
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0e13] px-5 text-[#f4f4f8]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-[3px] border-[#303044] border-t-[#635bff]" />
          <p className="text-sm text-[#a1a1b2]">
            A verificar a tua sessão...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0e13] px-5 text-[#f4f4f8]">
        <div className="w-full max-w-sm rounded-2xl border border-[#292a36] bg-[#15161e] p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#635bff] text-xl font-extrabold text-white">
            A
          </div>

          <h1 className="text-2xl font-bold">AuthFlow</h1>

          <p className="mt-3 text-sm leading-6 text-[#a1a1b2]">
            {error || 'A redirecionar para o login...'}
          </p>

          {error && (
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void loadProfile();
              }}
              className="mt-6 w-full rounded-xl bg-[#635bff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#554ce8]"
            >
              Tentar novamente
            </button>
          )}

          <button
            type="button"
            onClick={() => router.replace('/')}
            className="mt-5 text-sm font-medium text-[#aaa5ff] transition hover:text-white"
          >
            Ir para o login
          </button>
        </div>
      </main>
    );
  }

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return (
    <main className="flex min-h-screen flex-col bg-[#0d0e13] font-sans text-[#f4f4f8]">
      <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#252630] px-5 sm:px-[7%]">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-xl font-bold text-[#f4f4f8]"
        >
          <span className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-[#635bff] text-[21px] font-extrabold text-white">
            A
          </span>
          AuthFlow
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-xl border border-[#363744] px-3 py-2.5 text-xs font-medium text-[#c9c9d5] transition hover:border-[#635bff] hover:bg-[#171722] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:text-sm"
        >
          {loggingOut ? 'A terminar...' : 'Terminar sessão'}
        </button>
      </header>

      <section className="mx-auto w-full max-w-[650px] flex-1 px-5 py-14 sm:py-[76px]">
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#303044] bg-[#171622] px-3 py-2 text-xs text-[#bdb8ff]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#67d9a0] shadow-[0_0_9px_#67d9a055]" />
          Sessão autenticada
        </div>

        <h1 className="text-[clamp(38px,7vw,58px)] font-bold leading-[1.12] tracking-[-2px]">
          Bem-vindo,
          <br />
          <span className="break-words text-[#8b84ff]">{firstName}!</span>
        </h1>

        <p className="mb-9 mt-5 max-w-[470px] text-[15px] leading-8 text-[#a1a1b2]">
          A tua conta está pronta. Iniciaste sessão com sucesso no AuthFlow.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-[#69353d] bg-[#29171c] px-4 py-3 text-sm leading-6 text-[#ffb3bd]"
          >
            {error}
          </div>
        )}

        <div className="rounded-[18px] border border-[#292a36] bg-[#15161e] p-5 sm:p-[25px]">
          <div className="flex items-center gap-3.5">
            <div className="grid h-[49px] w-[49px] shrink-0 place-items-center rounded-[15px] bg-[#272448] text-[21px] font-bold text-[#b7b1ff]">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-base font-semibold">O teu perfil</h2>
              <p className="mt-1 text-xs text-[#8f90a2]">
                Informações da tua conta
              </p>
            </div>
          </div>

          <div className="my-6 h-px bg-[#2b2c38]" />

          <div className="flex flex-col gap-2 border-b border-[#252631] py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px] text-[#9293a5]">Nome</span>
            <span className="break-words text-[13px] text-[#ececf4] sm:text-right">
              {user.name}
            </span>
          </div>

          <div className="flex flex-col gap-2 border-b border-[#252631] py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px] text-[#9293a5]">E-mail</span>
            <span className="break-all text-[13px] text-[#ececf4] sm:text-right">
              {user.email}
            </span>
          </div>

          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[13px] text-[#9293a5]">
              Estado da conta
            </span>

            <span className="inline-flex items-center gap-2 text-xs text-[#76dca9]">
              <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#193b2d] text-[11px]">
                ✓
              </span>
              E-mail confirmado
            </span>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#85869a]">
          <span className="text-lg text-[#8b84ff]">♢</span>
          A tua área privada está protegida por autenticação.
        </p>
      </section>

      <footer className="flex flex-col gap-2 border-t border-[#252630] px-5 py-5 text-[11px] text-[#77788b] sm:flex-row sm:items-center sm:justify-between sm:px-[7%]">
        <span className="font-bold text-[#aaa9bd]">AuthFlow</span>
        <span>Autenticação segura, passo a passo.</span>
      </footer>
    </main>
  );
}
