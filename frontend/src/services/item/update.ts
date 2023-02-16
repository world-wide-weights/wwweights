import { AxiosResponse } from "axios"
import { SessionData } from "../../types/auth"
import { UpdateItemDto } from "../../types/item"
import { commandRequest } from "../axios/axios"

/**
 * Update an item with api
 * @param slug the slug of the item to update
 * @param updateItem the updated item fields
 * @param session the current session
 * @returns response from api
 */
export const updateItemApi = async (slug: string, updateItem: UpdateItemDto, session: SessionData): Promise<AxiosResponse> => {
    const response = await commandRequest.post(`items/${slug}/suggest/edit`, updateItem, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    })
    return response
}