/**
 * Formats a raw Greek phone number to E.164 format (+30XXXXXXXXXX)
 */
export function formatGreekPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    if (digits.startsWith('30') && digits.length === 12) return `+${digits}`
    if (digits.length === 10) return `+30${digits}`
    return `+30${digits}` // best-effort
}
