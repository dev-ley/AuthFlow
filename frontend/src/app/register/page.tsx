'use client';

import { API_URL } from '@/lib/api';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

type RegisterResponse = {
  message?: string | string[];
  messageDetail?: string;
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const passwordRules = [
    { label: 'Pelo menos 12 caracteres', valid: password.length >= 12 },
    { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Uma letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Um número', valid: /[0-9]/.test(password) },
    { label: 'Um símbolo especial', valid: /[^A-Za-z0-9]/.test(password) },
    {
      label: 'No máximo 72 bytes',
      valid: new TextEncoder().encode(password).length <= 72,
    },
  ];

  const passwordIsValid = passwordRules.every((rule) => rule.valid);
  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!passwordIsValid) {
      setFeedback({
        type: 'error',
        message: 'A senha ainda não cumpre todas as regras de segurança.',
      });
      return;
    }

    if (!passwordsMatch) {
      setFeedback({
        type: 'error',
        message: 'As senhas não coincidem.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(' ')
          : data.message;

        throw new Error(
          data.messageDetail ??
            message ??
            'Não foi possível criar a conta.',
        );
      }

      setFeedback({
        type: 'success',
        message:
          typeof data.message === 'string'
            ? data.message
            : 'Conta criada! Consulta a tua caixa de entrada para confirmares o e-mail.',
      });

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível contactar o servidor. Tenta novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0e13] px-4 py-8 font-sans text-[#f5f5fa] sm:px-6 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(99,91,255,0.12),transparent_65%)]"
      />

      <section className="relative w-full max-w-[460px] rounded-2xl border border-[#292a36] bg-[#15161e] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-[38px]">
        <header className="mb-7">
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
            CRIA A TUA CONTA
          </p>

          <h1 className="text-[32px] font-bold leading-tight tracking-[-1.2px] sm:text-[35px]">
            Começa por aqui.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#a5a5b5]">
            Cria a tua conta para começares a utilizar o AuthFlow.
          </p>
        </header>

        {feedback?.type === 'success' ? (
          <div
            className="py-2 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto mb-5 grid size-[58px] place-items-center rounded-full bg-[#15372b] text-[#68e0a5]">
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                aria-hidden="true"
                fill="none"
              >
                <path
                  d="m5 12 4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mb-3 text-2xl font-bold tracking-tight">
              Confirma o teu e-mail
            </h2>

            <p className="break-words text-sm leading-7 text-[#b4b4c2]">
              {feedback.message}
            </p>

            <p className="mt-3 text-xs leading-6 text-[#858597]">
              Abre a mensagem que te enviámos e clica no link de confirmação.
              Se não a encontrares, verifica também a pasta de spam.
            </p>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="mt-6 flex w-full items-center justify-center rounded-[10px] bg-[#635bff] px-5 py-[15px] text-sm font-bold text-white transition hover:bg-[#5148ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aaa4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15161e]"
            >
              Voltar ao formulário
            </button>

            <p className="mt-5 text-sm text-[#a5a5b5]">
              Já tens conta?{' '}
              <Link
                href="/"
                className="font-semibold text-[#aaa4ff] hover:text-[#d0ccff] hover:underline"
              >
                Iniciar sessão
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex min-w-0 flex-col gap-2">
              <label
                htmlFor="name"
                className="text-[13px] font-semibold text-[#e3e3ec]"
              >
                Nome completo
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Wesley Rodrigues"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full min-w-0 rounded-[10px] border border-[#353644] bg-[#101117] px-[15px] py-3.5 text-sm text-[#f5f5fa] outline-none transition placeholder:text-[#696a7c] focus:border-[#8178ff] focus:ring-[3px] focus:ring-[#635bff]/15"
              />
            </div>

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
                  placeholder="Cria uma senha segura"
                  autoComplete="new-password"
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-describedby="password-rules"
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

              <ul
                id="password-rules"
                className="mt-1 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2"
              >
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-start gap-2 text-[11px] leading-relaxed ${
                      rule.valid ? 'text-[#68e0a5]' : 'text-[#858597]'
                    }`}
                  >
                    <span className="shrink-0" aria-hidden="true">
                      {rule.valid ? '✓' : '○'}
                    </span>
                    <span>{rule.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-[13px] font-semibold text-[#e3e3ec]"
              >
                Confirmar senha
              </label>

              <div className="relative flex min-w-0 items-center">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repete a tua senha"
                  autoComplete="new-password"
                  maxLength={72}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  aria-describedby={
                    confirmPassword.length > 0
                      ? 'password-match'
                      : undefined
                  }
                  className="w-full min-w-0 rounded-[10px] border border-[#353644] bg-[#101117] py-3.5 pl-[15px] pr-[88px] text-sm text-[#f5f5fa] outline-none transition placeholder:text-[#696a7c] focus:border-[#8178ff] focus:ring-[3px] focus:ring-[#635bff]/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  className="absolute right-3 rounded px-1 py-1 text-xs font-semibold text-[#aaa4ff] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8178ff]"
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p
                  id="password-match"
                  aria-live="polite"
                  className={`text-xs ${
                    passwordsMatch ? 'text-[#68e0a5]' : 'text-[#ff929b]'
                  }`}
                >
                  {passwordsMatch
                    ? 'As senhas coincidem.'
                    : 'As senhas ainda não coincidem.'}
                </p>
              )}
            </div>

            {feedback?.type === 'error' && (
              <div
                role="alert"
                className="break-words rounded-[9px] border border-[#65333b] bg-[#2b1b20] px-3.5 py-3 text-[13px] leading-relaxed text-[#ffb0b6]"
              >
                {feedback.message}
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
                  A criar conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>

            <p className="text-center text-[11px] leading-6 text-[#77788b]">
              Ao criares uma conta, receberás um e-mail para confirmares o teu
              endereço antes de iniciar sessão.
            </p>

            <p className="text-center text-sm text-[#a5a5b5]">
              Já tens conta?{' '}
              <Link
                href="/"
                className="font-semibold text-[#aaa4ff] hover:text-[#d0ccff] hover:underline"
              >
                Iniciar sessão
              </Link>
            </p>
          </form>
        )}

        <footer className="mt-8 flex flex-col gap-2 border-t border-[#292a36] pt-5 text-center text-[11px] leading-relaxed text-[#77788b]">
          <span className="font-bold text-[#aaa4ff]">AuthFlow</span>
          <span>Autenticação simples. Segurança em primeiro lugar.</span>
        </footer>
      </section>
    </main>
  );
}