
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type VerificationStatus = 'loading' | 'success' | 'error';

type VerificationResult = {
  success: boolean;
  message: string;
};

const verificationRequests = new Map<
  string,
  Promise<VerificationResult>
>();

function getVerificationRequest(token: string): Promise<VerificationResult> {
  const existingRequest = verificationRequests.get(token);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async (): Promise<VerificationResult> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        {
          method: 'GET',
          cache: 'no-store',
        },
      );

      const data: { message?: string | string[] } =
        await response.json();

      const message = Array.isArray(data.message)
        ? data.message.join(' ')
        : data.message;

      if (!response.ok) {
        return {
          success: false,
          message:
            message ??
            'Este link é inválido, expirou ou já foi utilizado.',
        };
      }

      return {
        success: true,
        message:
          message ??
          'O teu endereço de e-mail foi confirmado com sucesso!',
      };
    } catch {
      return {
        success: false,
        message:
          'Não foi possível contactar o servidor. Tenta novamente mais tarde.',
      };
    }
  })();

  verificationRequests.set(token, request);

  return request;
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState(
    'A confirmar o teu endereço de e-mail...',
  );

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      if (!token) {
        setStatus('error');
        setMessage('O link de confirmação não contém um token válido.');
        return;
      }

      const result = await getVerificationRequest(token);

      if (cancelled) {
        return;
      }

      setStatus(result.success ? 'success' : 'error');
      setMessage(result.message);
    }

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0e13] px-5 py-8 font-sans text-[#f5f5fa]">
      <section
        className="w-full max-w-[440px] rounded-[20px] border border-[#292a36] bg-[#15161e] px-6 py-9 text-center shadow-[0_24px_70px_rgb(0_0_0/25%)] sm:px-8 sm:py-11"
        aria-labelledby="verification-title"
      >
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess
              ? 'bg-[#15372b] text-[#68e0a5]'
              : isError
                ? 'bg-[#3a2227] text-[#ff929b]'
                : 'bg-[#252637] text-[#aaa4ff]'
          }`}
        >
          {status === 'loading' ? (
            <span
              className="h-[27px] w-[27px] animate-spin rounded-full border-[3px] border-[#44445b] border-t-[#8178ff] motion-reduce:animate-none"
              role="status"
              aria-label="A carregar"
            />
          ) : isSuccess ? (
            <svg
              viewBox="0 0 24 24"
              className="h-[30px] w-[30px]"
              aria-hidden="true"
            >
              <path
                d="m5 12 4 4L19 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-[30px] w-[30px]"
              aria-hidden="true"
            >
              <path
                d="M12 8v5m0 4h.01M10.3 3.9 1.8 18.6a1.6 1.6 0 0 0 1.4 2.4h17.6a1.6 1.6 0 0 0 1.4-2.4L13.7 3.9a2 2 0 0 0-3.4 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <p className="mb-4 text-sm font-bold uppercase tracking-[2px] text-[#9189ff]">
          AuthFlow
        </p>

        <h1
          id="verification-title"
          className="mb-3 text-[clamp(24px,5vw,30px)] font-bold leading-tight tracking-[-0.7px]"
        >
          {status === 'loading'
            ? 'Só um momento'
            : isSuccess
              ? 'E-mail confirmado!'
              : 'Não foi possível confirmar'}
        </h1>

        <p
          className="mb-7 break-words text-[15px] leading-[1.7] text-[#aaaab9]"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>

        {(isSuccess || isError) && (
          <Link
            href="/"
            className="block w-full rounded-[10px] bg-[#635bff] px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#5148ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9189ff] motion-reduce:transition-none"
          >
            Voltar ao início
          </Link>
        )}

        {status === 'loading' && (
          <p className="mt-5 text-[13px] leading-relaxed text-[#77788b]">
            Estamos a validar o teu link em segurança.
          </p>
        )}
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#0d0e13] px-5 font-sans text-sm text-[#a1a1b2]">
          A carregar...
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
