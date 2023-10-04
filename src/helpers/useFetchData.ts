import {useEffect, useState} from 'react';

const BASE_URL = "http://154.56.63.127:5000";

export function useFetchData(endpoint: string) {
    const [data, setData] = useState<any>(null);
    const fullUrl = `${BASE_URL}${endpoint}`;

    useEffect(() => {
        fetch(fullUrl)
            .then(response => response.json())
            .then(jsonData => setData(jsonData))
            .catch(error => console.error(`Error fetching data from ${fullUrl}: `, error));
    }, [fullUrl]);

    return data;
}
