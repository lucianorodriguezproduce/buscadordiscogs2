export interface OrderData {
    order_number?: string;
    admin_offer_price?: number;
    admin_offer_currency?: string;
    details: {
        intent: string;
        artist: string;
        album: string;
        format: string;
        condition: string;
        price?: number;
        currency?: string;
    };
}

export const generateWhatsAppLink = (order: OrderData): string => {
    const phoneNumber = "5492974188914";
    const itemTitle = `${order.details.artist} - ${order.details.album}`;

    let message = `Hola Oldie But Goldie, mi número de orden es ${order.order_number || "N/A"}.\nQuiero ${order.details.intent.toLowerCase()}: ${itemTitle}.\nFormato: ${order.details.format} | Estado: ${order.details.condition}.`;

    if (order.admin_offer_price) {
        const currency = order.admin_offer_currency === "USD" ? "US$" : "$";
        message += `\nCotización Admin: ${currency} ${order.admin_offer_price.toLocaleString()}`;
    } else if (order.details.price) {
        const currency = order.details.currency === "USD" ? "US$" : "$";
        message += `\nPrecio: ${currency} ${order.details.price.toLocaleString()}`;
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
