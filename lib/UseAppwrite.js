import { Alert, useEffect, useState } from "react";


const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
    const [isLoading, setIsLoadng] = useState(true);
    
      const fetchData = async () => {
      setIsLoadng(true);
    
      try {
        const response = await fn();
    
        setData(response);
      } catch (error) {
        Alert.alert('Error', error.message)
      } finally{
        setIsLoadng(false);
      }

    }

    useEffect(() => {
      fetchData();
    }, []);


    const refetch = () => fetchData();
    
    
    return {data, isLoading, refetch}
    
}

export default useAppwrite