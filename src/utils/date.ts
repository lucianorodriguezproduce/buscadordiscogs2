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
