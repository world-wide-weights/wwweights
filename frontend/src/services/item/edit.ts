import { AxiosResponse } from "axios"
import { SessionData } from "../../types/auth"
import { CreateEditItemForm, EditItemDto, Item } from "../../types/item"
import { commandRequest } from "../axios/axios"

/**
 * Edit an item with api
 * @param slug the slug of the item to update
 * @param updateItem the updated item fields
 * @param session the current session
 * @returns response from api
 */
export const editItemApi = async (slug: string, updateItem: EditItemDto, session: SessionData): Promise<AxiosResponse> => {
    const response = await commandRequest.post(`items/${slug}/suggest/edit`, updateItem, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    })
    return response
}

/**
 * Prepare item data for edit item request.
 * @param values the updated item data from form
 * @param oldItem the old item data
 * @returns item data for edit item request
 */
export const prepareEditItem = (values: CreateEditItemForm, oldItem: Item): EditItemDto => {
    // Prepare additionalValue
    const additionalValue = values.valueType === "exact" ? null : Number(values.additionalValue)

    // Build weights object
    const weight = {
        ...(values.weight !== oldItem?.weight.value ? { value: Number(values.weight) } : {}),
        ...((values.isCa[0] !== undefined) !== oldItem?.weight.isCa ? { isCa: values.isCa[0] ? true : false } : {}),
        ...((values.additionalValue !== oldItem?.weight.additionalValue) || values.valueType === "exact" ? { additionalValue } : {})
    }

    // Calculates which tags to remove and which to add
    const pull = oldItem.tags.filter(tag => !values.tags?.includes(tag.name)).map(tag => tag.name)
    const push = values.tags?.filter(tag => !oldItem.tags.map(tag => tag.name).includes(tag)) ?? []

    // Build tags object
    const tags = {
        ...(pull.length > 0 ? { pull } : {}),
        ...(push.length > 0 ? { push } : {})
    }

    // Prepare item data update
    const editItem: EditItemDto = {
        ...(values.name !== oldItem?.name ? { name: values.name } : {}),
        ...((Object.keys(weight).length > 0) ? { weight } : {}),
        ...(!(values.source === oldItem?.source) ? { source: values.source } : {}),
        ...(values.source === "" ? { source: null } : {}),
        ...(values.imageFile === null ? { image: null } : {}),
        ...((Object.keys(tags).length > 0) ? { tags } : {}),
    }

    return editItem
}