import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Governia',
        short_name: 'Governia',
        description: 'Plataforma Oficial del Municipio de Soteapan',
        start_url: '/',
        display: 'standalone',
        background_color: '#04101f',
        theme_color: '#04101f',
        icons: [
            {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
