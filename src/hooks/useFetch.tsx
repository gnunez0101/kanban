import { useState, useEffect } from "react";

export function useFetch(url: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      setLoading(true);
      fetch(url)
        .then((response) => response.json())
        .then((data)     => setData(data))
        .catch((error)   => {setError(error)})
        .finally(()      => setLoading(false));
    }, []);
    return { data, loading, error };
}