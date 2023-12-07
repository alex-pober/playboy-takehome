import {useState, useEffect} from 'react'

const useBallotData = () => {
  const [ballotData, setBallotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBallorData = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/getBallotData');
        if (!response.ok) {
          throw new Error('Failed to fetch ballot data');
        }

        const data = await response.json();
        setBallotData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false)
      }
    }

    fetchBallorData();
  }, [])

  return {ballotData, loading, error}
}

export default useBallotData;
