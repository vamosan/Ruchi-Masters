// Cloudflare Pages Function for Tournament Config & Instagram Feed Global Multi-Device Sync

interface Env {
  TOURNAMENT_KV?: any;
  KV?: any;
  STORAGE?: any;
  RUCI_KV?: any;
  CRICMASTER_KV?: any;
}

let tournamentMemoryCache: any = null;

const getKV = (env: Env) => {
  return env.TOURNAMENT_KV || env.KV || env.STORAGE || env.RUCI_KV || env.CRICMASTER_KV;
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const onRequestGet = async (context: { env: Env }) => {
  const kv = getKV(context.env);
  try {
    if (kv) {
      const data = await kv.get('tournament_data', 'json');
      if (data) {
        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Storage-Backend': 'cloudflare_kv',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    if (tournamentMemoryCache) {
      return new Response(JSON.stringify(tournamentMemoryCache), {
        headers: {
          'Content-Type': 'application/json',
          'X-Storage-Backend': 'edge_memory',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ status: 'no_remote_data', storage: kv ? 'cloudflare_kv' : 'edge_memory' }), {
      headers: {
        'Content-Type': 'application/json',
        'X-Storage-Backend': kv ? 'cloudflare_kv' : 'edge_memory',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return new Response(JSON.stringify({ error: 'Invalid Tournament payload' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    tournamentMemoryCache = body;
    const kv = getKV(context.env);

    if (kv) {
      await kv.put('tournament_data', JSON.stringify(body));
      return new Response(JSON.stringify({ success: true, storage: 'cloudflare_kv' }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Storage-Backend': 'cloudflare_kv',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ success: true, storage: 'edge_memory' }), {
      headers: {
        'Content-Type': 'application/json',
        'X-Storage-Backend': 'edge_memory',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Save failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
