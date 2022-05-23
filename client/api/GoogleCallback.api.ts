export const googleCallbackApi = async (query: string) => {
    try {
        const response = await fetch(`${process.env.URL_LOGIN_GOOGLE_CALLBACK}${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json();
    } catch (e) {
        return null;
    }
};