import { SessionData } from "../../types/auth"

const LOCAL_STORAGE_KEY = "session"

export const saveSession = (sessionData: SessionData): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData))
}

export const deleteSession = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
}

export const getSession = (): SessionData | null => {
    const sessionData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (sessionData) {
        return JSON.parse(sessionData)
    }
    return null
}