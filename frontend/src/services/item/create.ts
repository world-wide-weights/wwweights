import { AxiosResponse } from "axios"
import { SessionData } from "../../types/auth"
import { CreateItemDto } from "../../types/item"
import { commandRequest } from "../axios/axios"

/**
 * Create a new item with api
 * @param item the item to create
 * @param session the current session
 * @returns response from api
 */
export const createNewItemApi = async (item: CreateItemDto, session: SessionData): Promise<AxiosResponse> => {
    const response = await commandRequest.post("/items/insert", item, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    })
    return response
}