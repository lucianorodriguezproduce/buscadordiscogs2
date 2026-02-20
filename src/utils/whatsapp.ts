export interface OrderData {
    order_number?: string;
    item_id?: number | string;
    type?: string;
    item_type?: string;
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
    const itemTitle = `${order.details.album} - ${order.details.artist}`;

    const intentStr = order.details.intent ? order.details.intent.toUpperCase() : "";
    let actionText = "Me interesa este disco";

    if (intentStr === "COMPRAR" || intentStr === "EN COMPRA") {
        actionText = "Quiero vender este disco";
    } else if (intentStr === "VENDER" || intentStr === "EN VENTA") {
        actionText = "Quiero comprar este disco";
    }

    const typeStr = order.type || order.item_type || "release";
    const idStr = order.item_id || "";

    let message = `Hola Oldie but Goldie! ${actionText}: ${itemTitle}.`;

    if (idStr) {
        message += ` Aquí puedes ver los detalles: https://buscadordiscogs-mslb.vercel.app/item/${typeStr}/${idStr}`;
    }

    if (order.order_number) {
        message += `\n\nOrden de referencia: ${order.order_number}`;
    }

    message += `\nFormato: ${order.details.format} | Estado: ${order.details.condition}`;

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
