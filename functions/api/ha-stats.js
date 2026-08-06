// /api/ha-stats — server-side proxy for Home Assistant's long-term Statistics API.
//
// WHY: history/statistics_during_period (the call that returns real hourly/daily consumption,
// as opposed to raw state-change history) has no REST equivalent in HA — it's a WebSocket-only
// command. /api/ha (see ha.js) is a plain HTTP reverse proxy and can't reach it. This function
// opens a short-lived outbound WebSocket to the same allow-listed Nabu Casa host, authenticates
// with the token the browser sends (never stored here — same pattern as ha.js), sends exactly
// one history/statistics_during_period command, and returns the JSON result over a normal HTTP
// response so the browser never has to speak WebSocket itself.

const ALLOWED_HOSTS = ['kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa'];
const DEFAULT_BASE = 'https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa';
const WS_TIMEOUT_MS = 15000;

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const statisticId = url.searchParams.get('statistic_id');
  const startTime = url.searchParams.get('start_time');
  const endTime = url.searchParams.get('end_time') || new Date().toISOString();
  const period = url.searchParams.get('period') || 'hour';

  if (!statisticId || !startTime) {
    return Response.json({ error: 'statistic_id and start_time are required' }, { status: 400 });
  }
  if (period !== 'hour' && period !== 'day') {
    return Response.json({ error: 'period must be hour or day' }, { status: 400 });
  }

  const auth = request.headers.get('Authorization');
  if (!auth) return Response.json({ error: 'missing Authorization' }, { status: 401 });

  let base = request.headers.get('X-HA-Base') || DEFAULT_BASE;
  let target;
  try { target = new URL(base); } catch (e) { target = new URL(DEFAULT_BASE); }
  if (!ALLOWED_HOSTS.includes(target.hostname)) target = new URL(DEFAULT_BASE);

  const wsUrl = 'https://' + target.hostname + '/api/websocket';

  try {
    const result = await fetchStatistics(wsUrl, auth, statisticId, startTime, endTime, period);
    return Response.json(
      { statistics: result },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    return Response.json(
      { error: 'ha_ws_unreachable', detail: String((e && e.message) || e) },
      { status: 502 }
    );
  }
}

function fetchStatistics(wsUrl, authHeader, statisticId, startTime, endTime, period) {
  return new Promise((resolve, reject) => {
    let ws = null;
    let done = false;

    const finish = (fn, arg) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { if (ws) ws.close(); } catch (e) {}
      fn(arg);
    };

    const timer = setTimeout(() => finish(reject, new Error('ha_ws_timeout')), WS_TIMEOUT_MS);

    fetch(wsUrl, { headers: { Upgrade: 'websocket' } })
      .then((resp) => {
        ws = resp.webSocket;
        if (!ws) { finish(reject, new Error('no_websocket_in_response')); return; }
        ws.accept();

        const msgId = 1;
        const token = authHeader.replace(/^Bearer\s+/i, '');

        ws.addEventListener('message', (evt) => {
          if (done) return;
          let msg;
          try { msg = JSON.parse(evt.data); } catch (e) { return; }

          if (msg.type === 'auth_required') {
            ws.send(JSON.stringify({ type: 'auth', access_token: token }));
          } else if (msg.type === 'auth_invalid') {
            finish(reject, new Error('ha_auth_invalid'));
          } else if (msg.type === 'auth_ok') {
            ws.send(JSON.stringify({
              id: msgId,
              type: 'history/statistics_during_period',
              start_time: startTime,
              end_time: endTime,
              statistic_ids: [statisticId],
              period: period,
              types: ['change', 'sum', 'state']
            }));
          } else if (msg.type === 'result' && msg.id === msgId) {
            if (msg.success) finish(resolve, (msg.result && msg.result[statisticId]) || []);
            else finish(reject, new Error((msg.error && msg.error.message) || 'ha_ws_command_failed'));
          }
        });

        ws.addEventListener('close', () => finish(reject, new Error('ha_ws_closed_early')));
        ws.addEventListener('error', () => finish(reject, new Error('ha_ws_error')));
      })
      .catch((e) => finish(reject, e));
  });
}
