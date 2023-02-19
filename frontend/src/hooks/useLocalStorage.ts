import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from "react"

/**
 * Custom Hook for sync state with local storage.
 * @param key the localstorage key where the state gets saved.
 * @param initialValue the fallback value if no value is set.
 * @param initialRenderRef ref from component with inital value true (need to check when we are on first render to set intial value correct).
 * @returns [ value: the state we sync, loading: loading state from the synced value, setValue: update the state ]
 */
export const useLocalStorage = <T>(key: string, initialValue: T, initialRenderRef: MutableRefObject<boolean>): readonly [T, Dispatch<SetStateAction<T>>, boolean] => {
	const [value, setValue] = useState<T>(initialValue)
	const [loading, setLoading] = useState<boolean>(true)

	/**
	 * Sets the inital state from localstorage or set initialValue when not set jet.
	 */
	useEffect(() => {
		const stored = (localStorage.getItem(key) as T) ?? initialValue
		setValue(stored)
	}, [key, initialValue])

	/**
	 * Updates the state in localstorage.
	 */
	useEffect(() => {
		/**
		 * When we are on first render initialRenderRef is true on second render false.
		 * On first render we should not update localstorage because we would reset the value.
		 */
		if (initialRenderRef.current) {
			initialRenderRef.current = false
			setLoading(false)
			return
		}

		// Sets item in localstorage
		localStorage.setItem(key, value as string)
	}, [initialRenderRef, key, value])

	return [value, setValue, loading] as const
}
