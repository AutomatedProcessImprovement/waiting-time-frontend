import { useQuery } from 'react-query';

const BASE_URL = "http://193.40.11.233/db-api/";

export function useFetchData(endpoint: string) {
    const fullUrl = `${BASE_URL}${endpoint}`;

    const { data, isLoading, isError, error } = useQuery(endpoint, async () => {
        const response = await fetch(fullUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Network error: ${response.status} - ${text}`);
        }
        return response.json();
    }, {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    if (isLoading) return null;
    if (isError) {
        console.error(error);
        return null;
    }

    return data;
}
