declare global {
    interface Window {
        dataLayer: any[];
    }
}

export const pushViewItem = (item: any, intent: string) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];

        let genreCategory = "N/A";
        if (item.genre && item.genre.length > 0) {
            genreCategory = item.genre[0];
        } else if (item.style && item.style.length > 0) {
            genreCategory = item.style[0];
        }

        const artistName = item.title?.includes(' - ') ? item.title.split(' - ')[0] : item.title;
        const albumName = item.title?.includes(' - ') ? item.title.split(' - ')[1] : item.title;

        window.dataLayer.push({
            'event': 'view_item',
            'ecommerce': {
                'detail': {
                    'products': [{
                        'id': item.id?.toString(),
                        'name': albumName?.trim() || item.title,
                        'brand': artistName?.trim() || 'Unknown',
                        'category': genreCategory,
                        'variant': intent
                    }]
                }
            }
        });
    }
};

export const pushViewItemFromOrder = (order: any) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            'event': 'view_item',
            'ecommerce': {
                'detail': {
                    'products': [{
                        'id': order.item_id?.toString() || 'N/A',
                        'name': order.details?.album || 'Unknown',
                        'brand': order.details?.artist || 'Unknown',
                        'category': 'N/A', // Genre logic usually not stored statically in orders
                        'variant': order.details?.intent || 'OBSERVANDO'
                    }]
                }
            }
        });
    }
};

export const pushWhatsAppContactFromOrder = (order: any) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            'event': 'whatsapp_contact',
            'item_id': order.item_id?.toString() || 'N/A',
            'item_name': order.details?.album || 'Unknown',
            'intent': order.details?.intent || 'UNKNOWN'
        });
    }
};
