import { useQuery } from 'react-query';

const BASE_URL = "http://154.56.63.127:5000";

export function useFetchData(endpoint: string) {
    const fullUrl = `${BASE_URL}${endpoint}`;

    const { data, isLoading, isError, error } = useQuery(endpoint, async () => {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error('Network error');
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
