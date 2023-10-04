import { useState, useEffect } from 'react';

export function useFetchData(url: string) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(jsonData => setData(jsonData))
            .catch(error => console.error(`Error fetching data from ${url}: `, error));
    }, [url]);

    return data;
}
