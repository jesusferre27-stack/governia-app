/**
 * Formatea una fecha en formato relativo (ej: Hace 5 min, Ayer, etc.)
 * Maneja desviaciones de reloj mostrando "Justo ahora" para tiempos negativos.
 */
export function timeAgo(dateStr: string | null | undefined): string {
    if (!dateStr) return "N/D";
    
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Si la diferencia es negativa o menor a 1 minuto, mostrar "Justo ahora"
    if (diff < 60000) return "Justo ahora";
    
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins} min`;
    
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    
    // Para fechas más antiguas, mostrar la fecha legible
    return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

/**
 * Formatea una fecha en formato completo (ej: 12 de mayo, 2026)
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "N/D";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}
