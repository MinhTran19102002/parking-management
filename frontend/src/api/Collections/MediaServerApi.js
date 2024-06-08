import {GET, POST} from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN_MEDIA;

export default {
    captureImageFromStream: () => {
        const url = `${DOMAIN}/imagecap`;
        return GET({
            url
        })
    },

    getLicensesFromStream: () => {
        const url = `${DOMAIN}/licenseS`;
        return GET({
            url
        })
    }
}
