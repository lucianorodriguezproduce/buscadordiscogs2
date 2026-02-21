export const formatDate = (date: any) => {
    if (!date) return "N/A";

    // Handle Firebase Timestamp
    let d = date;
    if (date.seconds) {
        d = new Date(date.seconds * 1000);
    } else if (!(date instanceof Date)) {
        d = new Date(date);
    }

    if (isNaN(d.getTime())) return "N/A";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    // Relative time logic
    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;

    // Absolute time logic
    return new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(d);
};

export const getReadableDate = (ts: any) => {
    if (!ts) return "Procesando...";
    try {
        let date: Date;
        if (ts.toDate) {
            date = ts.toDate();
        } else if (ts.seconds) {
            date = new Date(ts.seconds * 1000);
        } else if (ts instanceof Date) {
            date = ts;
        } else {
            date = new Date(ts);
        }

        if (isNaN(date.getTime())) return "Fecha no disponible";

        return date.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Fecha no disponible";
    }
};
