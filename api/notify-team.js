function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { teamId } = req.body || {};
    if (!teamId) {
        return res.status(400).json({ error: 'teamId required' });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL;
    const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL || 'https://torneo-3x3-torrevieja.vercel.app/admin.html';

    try {
        const teamRes = await fetch(
            `${SUPABASE_URL}/rest/v1/teams?id=eq.${teamId}&select=*,players(*)`,
            {
                headers: {
                    apikey: SERVICE_KEY,
                    Authorization: `Bearer ${SERVICE_KEY}`
                }
            }
        );

        if (!teamRes.ok) {
            const errText = await teamRes.text();
            return res.status(502).json({ error: 'Supabase fetch failed', details: errText });
        }

        const teams = await teamRes.json();
        const team = teams[0];
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        const players = team.players || [];
        const playersHtml = players.map((p, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.dni)}</td>
                <td>${escapeHtml(p.birth_date)}</td>
                <td>${escapeHtml(p.shirt_size)} / ${escapeHtml(p.shirt_size_2) || '—'}</td>
            </tr>
        `).join('');

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color:#1E3A5F;">🏀 Nueva inscripción: ${escapeHtml(team.name)}</h2>
                <p>
                    <strong>Capitán:</strong> ${escapeHtml(team.captain_name)}<br>
                    <strong>Teléfono:</strong> ${escapeHtml(team.captain_phone)}<br>
                    <strong>Email:</strong> ${escapeHtml(team.captain_email)}<br>
                    <strong>Estado de pago:</strong> ${team.payment_status === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}
                </p>
                <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px;">
                    <tr style="background:#F0EDE7;">
                        <th>#</th><th>Nombre</th><th>DNI</th><th>Nacimiento</th><th>Talla (1ª/2ª)</th>
                    </tr>
                    ${playersHtml}
                </table>
                <p style="margin-top: 24px;">
                    <a href="${ADMIN_PANEL_URL}" style="background:#FF6B35; color:white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                        Ir al Panel de Administración
                    </a>
                </p>
            </div>
        `;

        const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Open 3x3 Torrevieja <onboarding@resend.dev>',
                to: [ADMIN_EMAIL],
                subject: `Nueva inscripción: ${team.name}`,
                html
            })
        });

        if (!emailRes.ok) {
            const errText = await emailRes.text();
            return res.status(502).json({ error: 'Resend send failed', details: errText });
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
