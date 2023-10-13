import { useQuery } from 'react-query';

const BASE_URL = "http://193.40.11.233:5000/";

export function useFetchData(endpoint: string) {
    const fullUrl = `${BASE_URL}${endpoint}`;

    const { data, isLoading, isError, error } = useQuery(endpoint, async () => {
        const response = await fetch(fullUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });
        const responseData = await response.json();
        console.log('Fetched data from:', fullUrl, responseData);
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} - ${JSON.stringify(responseData)}`);
        }
        return responseData;
    }, {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    if (isLoading) {
        console.error('Error, isLoading');
        return {};
    }
    if (isError) {
        console.error('Error fetching data:', error);
        return {};
    }

    return data;
}
