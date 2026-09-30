import { useEffect, useState } from 'react';
import api from '../service/api';

export default function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    api.get(url)
      .then(({ data }) => { if (!cancel) setData(data); })
      .catch((err) => { if (!cancel) setError(err); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, deps);

  return { data, loading, error, setData };
}