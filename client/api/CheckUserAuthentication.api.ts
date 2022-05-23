export const checkUserAuthentication = async (token: string | null) => {
    try {
        if (!token) {
            return null;
        }
        const response = await fetch(`${process.env.URL_API}/user/get-user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });
        return response.json();
    } catch(error) {
        return null;
    }
}
