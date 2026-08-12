const tailwindTheme = {
    colors: {
        brand: {
            primary: '#3b82f6',
            secondary: '#d946ef',
            accent: '#10b981',
        },
        semantic: {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
        },
        listing: {
            adoption: '#10b981',
            rehoming: '#f59e0b',
            sale: '#3b82f6',
            lost: '#ef4444',
            found: '#8b5cf6',
        },
        species: {
            dog: '#f97316',
            cat: '#8b5cf6',
            bird: '#06b6d4',
            fish: '#3b82f6',
            rabbit: '#ec4899',
            hamster: '#eab308',
            reptile: '#10b981',
            other: '#6b7280',
        },
    },
    gradients: {
        hero: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        card: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)',
        overlay: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
    },
};

export default tailwindTheme;