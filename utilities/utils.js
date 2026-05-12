export function convertSouthAsianPrice(priceString) {
    if (!priceString || typeof priceString !== "string") return 0;

    // 1. Normalize string
    const clean = priceString
        .toLowerCase()
        .replace(/[,]/g, "")              // remove commas
        .replace(/rs\.?|pkr|₨/g, "")      // remove currency symbols/words
        .trim();

    // 2. Handle non-numeric cases
    if (
        /negotiable|call|contact|poa|price on ask|free/i.test(clean)
    ) {
        return 0;
    }

    // 3. Extract number + optional unit (robust)
    const match = clean.match(/(\d+(\.\d+)?)\s*([a-z]+)?/i);

    if (!match) return 0;

    let value = parseFloat(match[1]);
    let unit = (match[3] || "").toLowerCase();

    // 4. Normalized multipliers (covers OLX + real usage)
    const multipliers = {
        lac: 100000,
        lakh: 100000,
        lacs: 100000,
        lakhs: 100000,

        crore: 10000000,
        crores: 10000000,
        cr: 10000000,

        k: 1000,
        th: 1000,
        thousand: 1000,

        m: 1000000,
        million: 1000000
    };

    // 5. Apply multiplier safely
    if (multipliers[unit]) {
        value *= multipliers[unit];
    }

    // 6. Final safety check (avoid NaN)
    return Number.isFinite(value) ? value : 0;
}


export function parseRelativeDate(text, baseDate = new Date()) {
    if (!text || typeof text !== "string") return null;

    const now = new Date(baseDate);
    const lower = text.toLowerCase().trim();

    // helper
    const subtract = (amount, unit) => {
        const d = new Date(now);

        const map = {
            minute: 60000,
            minutes: 60000,
            hour: 3600000,
            hours: 3600000,
            day: 86400000,
            days: 86400000,
            week: 7 * 86400000,
            weeks: 7 * 86400000,
            month: 30 * 86400000,
            months: 30 * 86400000,
            year: 365 * 86400000,
            years: 365 * 86400000
        };

        d.setTime(d.getTime() - amount * (map[unit] || 0));
        return d;
    };

    // "just now"
    if (lower.includes("just now")) {
        return now.toISOString();
    }

    // "1 week ago", "2 days ago", etc.
    let match = lower.match(/(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s*ago/);

    if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        return subtract(value, unit).toISOString();
    }

    // fallback: if already ISO or date
    const direct = new Date(text);
    if (!isNaN(direct.getTime())) {
        return direct.toISOString();
    }

    return null;
}