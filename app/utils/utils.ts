import config from '../../config';

const getFullImagePath = (relativePath: string | null | undefined): string | null => {
    if (!relativePath) {
        return null;
    }
    return `${config.API_URL_PHOTO}${relativePath}`;
};

export default getFullImagePath;