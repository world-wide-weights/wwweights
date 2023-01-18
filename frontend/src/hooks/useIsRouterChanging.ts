import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// https://github.com/vercel/next.js/issues/39128

/**
 * Gets state if router is currently change route (to prevent issues from double changing)
 * @returns the router currently change url 
 */
export const useIsRouterChanging = () => {
    const [isChanging, setIsChanging] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleStart = () => {
            setIsChanging(true)
        }
        const handleStop = () => {
            setIsChanging(false)
        }

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleStop)
        router.events.on('routeChangeError', handleStop)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleStop)
            router.events.off('routeChangeError', handleStop)
        }
    }, [router])

    return isChanging
}