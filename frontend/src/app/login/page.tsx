'use client';
import { API_URL } from '@/lib/api';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LoginResponse = {
  message?: string | string[];
  messageDetail?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setFeedback('Preenche o e-mail e a senha.');
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setFeedback('A senha introduzida é demasiado longa.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        },
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(' ')
          : data.message;

        throw new Error(
          data.messageDetail ??
            message ??
            'Não foi possível iniciar sessão.',
        );
      }

      router.replace('/dashboard');
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Não foi possível contactar o servidor. Tenta novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0e13] px-4 py-12 font-sans text-[#f5f5fa] sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(99,91,255,0.12),transparent_65%)]"
      />

      <section className="relative w-full max-w-[460px] rounded-2xl border border-[#292a36] bg-[#15161e] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-[38px]">
        <header className="mb-8">
          <Link
            href="/"
            aria-label="AuthFlow - início"
            className="mb-8 inline-flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-[#f5f5fa]"
          >
            <span className="grid size-[34px] place-items-center rounded-[10px] bg-[#635bff] text-lg text-white">
              A
            </span>
            <span>AuthFlow</span>
          </Link>

          <p className="mb-3 text-[11px] font-bold tracking-[2px] text-[#9189ff]">
            BEM-VINDO DE VOLTA
          </p>

          <h1 className="text-[32px] font-bold leading-tight tracking-[-1.2px] sm:text-[35px]">
            Entra na tua conta.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#a5a5b5]">
            Inicia sessão para continuares no AuthFlow.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[13px] font-semibold text-[#e3e3ec]"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@exemplo.com"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full min-w-0 rounded-[10px] border border-[#353644] bg-[#101117] px-[15px] py-3.5 text-sm text-[#f5f5fa] outline-none transition placeholder:text-[#696a7c] focus:border-[#8178ff] focus:ring-[3px] focus:ring-[#635bff]/15"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-[#e3e3ec]"
            >
              Senha
            </label>

            <div className="relative flex min-w-0 items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Introduz a tua senha"
                autoComplete="current-password"
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full min-w-0 rounded-[10px] border border-[#353644] bg-[#101117] py-3.5 pl-[15px] pr-[88px] text-sm text-[#f5f5fa] outline-none transition placeholder:text-[#696a7c] focus:border-[#8178ff] focus:ring-[3px] focus:ring-[#635bff]/15"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 rounded px-1 py-1 text-xs font-semibold text-[#aaa4ff] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8178ff]"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {feedback && (
            <div
              role="alert"
              className="break-words rounded-[9px] border border-[#65333b] bg-[#2b1b20] px-3.5 py-3 text-[13px] leading-relaxed text-[#ffb0b6]"
            >
              {feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-[#635bff] px-5 py-[15px] text-sm font-bold text-white transition hover:bg-[#5148ed] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aaa4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15161e]"
          >
            {loading ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-[15px] animate-spin rounded-full border-2 border-white/35 border-t-white motion-reduce:animate-none"
                />
                A iniciar sessão...
              </>
            ) : (
              'Iniciar sessão'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#a5a5b5]">
          Ainda não tens conta?{' '}
          <Link
            href="/register"
            className="font-semibold text-[#aaa4ff] transition hover:text-[#d0ccff] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8178ff]"
          >
            Criar conta
          </Link>
        </p>

        <footer className="mt-8 flex flex-col gap-2 border-t border-[#292a36] pt-5 text-center text-[11px] leading-relaxed text-[#77788b]">
          <span className="font-bold text-[#aaa4ff]">AuthFlow</span>
          <span>Autenticação simples. Segurança em primeiro lugar.</span>
        </footer>
      </section>
    </main>
  );
}

