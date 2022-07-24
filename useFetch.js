import { useState, useEffect, useRef } from 'react'

const useFetch = (url, _options) => {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    // use useRef to wrap an object/array argument
    // which is a useEffect dependency
    const options = useRef(_options).current

    useEffect(() => {
        console.log(options)
        const controller = new AbortController()

        const fetchData = async () => {
            setIsPending(true)

            try{
                const response = await fetch(url, { signal: controller.signal }) // second argument associates fetch request with controller
                // so if needed, controller knows what fetch request to abort
                if(!response.ok) {
                    throw new Error(response.statusText) // this will be passed into err in catch(err)
                }

                const raw_data = await response.json()
  
                setIsPending(false)
                setData(raw_data)
                setError(null)
            } catch (err){
                if(err.name === "AbortError"){ // check if fetch was aborted
                    // throw new Error will throw specific error if fetch was aborted and we can check for it here, to throw specific error to user (or do something.)
                    console.log('the fetch was aborted')
                    // notice how we dont update the state in this code block
                }
                else{ // every other error than AbortError
                    setIsPending(false)
                    setError('Could not fetch the data')
                }
            }
    
        }
        fetchData()

        return () => { // this is where we abort fetch request
            controller.abort()
        }
    }, [url, options])

    return { data, isPending, error } // same as {data: data}
}

export default useFetch