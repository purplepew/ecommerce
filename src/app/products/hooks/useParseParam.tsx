export default function parseParam<T>(param: string | null, fallback: T): T {
    if (param == null) return fallback
    try {
        const parsed = JSON.parse(param)
        if (typeof fallback == typeof parsed) return parsed
    } catch { }
    return fallback
}