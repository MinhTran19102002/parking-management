export const lazyRetry = function (componentImport) {
    return new Promise((resolve, reject) => {
        componentImport().then((component) => {
            resolve(component);
        }).catch((error) => {
            return null
        });
    });
};
