import images from '@/assets/images';

const hasImageUrl = (value) => typeof value === 'string' && value.trim().length > 0;

export const getPosterImage = (media) => {
    const posterUrl = media?.posterURL ?? media?.posterUrl ?? media?.poster;
    return hasImageUrl(posterUrl) ? posterUrl : images.noPoster;
};

export const getBackdropImage = (media) => {
    const backdropUrl = media?.backdropURL ?? media?.backdropUrl ?? media?.backdrop;
    if (hasImageUrl(backdropUrl)) {
        return backdropUrl;
    }

    const posterUrl = media?.posterURL ?? media?.posterUrl ?? media?.poster;
    return hasImageUrl(posterUrl) ? posterUrl : images.noBackdrop;
};

export const sanitizeMediaList = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);
