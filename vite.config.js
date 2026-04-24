import { appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// #region agent log
const DEBUG_INGEST =
  'http://127.0.0.1:7550/ingest/8c35ebc9-35a0-4f4f-a497-01a7ce6dd316'
const DEBUG_SESSION = '457ea6'
const DEBUG_LOG_FILE = fileURLToPath(new URL('./debug-457ea6.log', import.meta.url))

function agentLog(location, message, data, hypothesisId) {
  const payload = {
    sessionId: DEBUG_SESSION,
    location,
    message,
    data,
    timestamp: Date.now(),
    hypothesisId,
    runId: process.env.VITE_DEBUG_RUN_ID ?? 'pre-fix',
  }
  fetch(DEBUG_INGEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': DEBUG_SESSION,
    },
    body: JSON.stringify(payload),
  }).catch(() => {})
  try {
    appendFileSync(DEBUG_LOG_FILE, `${JSON.stringify(payload)}\n`)
  } catch {
    /* ignore */
  }
}

/** Logs bind address, printed URLs, host/HMR/allowedHosts — VPN-related hypotheses. */
function vpnDebugPlugin() {
  return {
    name: 'agent-vpn-debug',
    configureServer(server) {
      const s = server.config.server
      agentLog(
        'vite.config.js:configureServer',
        'resolved server options',
        {
          host: s.host === undefined ? null : s.host,
          port: s.port,
          strictPort: s.strictPort,
          allowedHosts: s.allowedHosts,
          hmr: s.hmr === undefined ? null : s.hmr,
        },
        'H2',
      )

      const httpServer = server.httpServer
      if (!httpServer) return

      const onListening = () => {
        const addr = httpServer.address()
        const urls = server.resolvedUrls
        agentLog(
          'vite.config.js:listening',
          'listen address and resolvedUrls',
          {
            address:
              typeof addr === 'string'
                ? { path: addr }
                : addr
                  ? { port: addr.port, address: addr.address, family: addr.family }
                  : null,
            resolvedLocalCount: urls?.local?.length ?? null,
            resolvedNetworkCount: urls?.network?.length ?? null,
            hasNetworkUrl: (urls?.network?.length ?? 0) > 0,
          },
          'H1',
        )
      }

      if (httpServer.listening) queueMicrotask(onListening)
      else httpServer.once('listening', () => queueMicrotask(onListening))

      // Log first request Host (runs before host-validation by prepending to connect stack)
      const firstHost = { logged: false }
      const stack = server.middlewares.stack
      if (Array.isArray(stack)) {
        stack.unshift({
          route: '',
          handle(req, res, next) {
            if (!firstHost.logged) {
              firstHost.logged = true
              const host = req.headers.host
              const raw = host?.replace(/:\d+$/, '') ?? ''
              const looksLocal =
                raw === 'localhost' ||
                raw.endsWith('.localhost') ||
                /^[\d.:]+$/.test(raw)
              agentLog(
                'vite.config.js:first-request',
                'first HTTP request Host header',
                { hostHeader: host, hostWithoutPort: raw, looksLocalhostOrIp: looksLocal },
                'H5',
              )
            }
            next()
          },
        })
      }
    },
  }
}
// #endregion

// https://vite.dev/config/
export default defineConfig({
  // Avoid IPv6-only ::1 bind so localhost→127.0.0.1 still connects (common with VPN/DNS).
  server: {
    host: true,
  },
  plugins: [react(), vpnDebugPlugin()],
})
