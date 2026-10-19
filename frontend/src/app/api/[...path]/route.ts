import { NextRequest, NextResponse } from 'next/server';


const API_BASE_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'A URL do backend não está configurada.' },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const baseUrl = API_BASE_URL.replace(/\/+$/, '');
  const targetUrl = `${baseUrl}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('connection');
  headers.delete('content-length');
  headers.delete('accept-encoding');

  try {
    const hasBody = !['GET', 'HEAD'].includes(request.method);

    const upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
      redirect: 'manual',
    });

    const responseHeaders = new Headers(upstreamResponse.headers);

    responseHeaders.delete('connection');
    responseHeaders.delete('content-length');
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');
    responseHeaders.delete('set-cookie');

    const response = new NextResponse(
      request.method === 'HEAD' ? null : await upstreamResponse.arrayBuffer(),
      {
        status: upstreamResponse.status,
        headers: responseHeaders,
      },
    );

    const getSetCookie = (
      upstreamResponse.headers as Headers & {
        getSetCookie?: () => string[];
      }
    ).getSetCookie;

    const cookies = getSetCookie?.call(upstreamResponse.headers) ?? [];

    for (const cookie of cookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível conectar ao servidor.' },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}
