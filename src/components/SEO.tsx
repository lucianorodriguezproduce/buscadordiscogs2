import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: Record<string, any>;
}

export function SEO({
    title = 'Oldie but Goldie - Archivos de Audio y Vinilos',
    description = 'El sistema definitivo para el coleccionismo físico. Explora nuestro archivo, cotiza en tiempo real, compra o vende reliquias con nosotros.',
    image = 'https://oldie-but-goldie.vercel.app/og-image.jpg', // URL genérica para OpenGraph
    url,
    type = 'website',
    schema
}: SEOProps) {
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://oldie-but-goldie.vercel.app');

    // Make sure image is an absolute HTTPS URL if it isn't already
    const ogImage = image.startsWith('http') ? image : `https://oldie-but-goldie.vercel.app${image.startsWith('/') ? '' : '/'}${image}`;

    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "OnlineStore",
        "name": "Oldie but Goldie",
        "url": currentUrl,
        "description": description,
        "image": image,
        "founder": "Luciano Rodriguez"
    };

    const finalSchema = schema || defaultSchema;

    return (
        <Helmet>
            {/* Standard HTML Metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Robots directive for staging */}
            <meta name="robots" content="noindex, nofollow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Helmet>
    );
}
