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
    const newAdditionalValue = values.valueType === "exact" ? null : Number(values.additionalValue)
    const oldAdditionalValue = oldItem.weight.additionalValue ? Number(oldItem.weight.additionalValue) : null
    const additionalValue = newAdditionalValue !== oldAdditionalValue ? { additionalValue: newAdditionalValue } : {}

    // Prepare isCa value
    const isNewCaValue = values.isCa[0] ? true : false
    const isOldCaValue = oldItem.weight.isCa ? true : false
    const caValue = isNewCaValue !== isOldCaValue ? { isCa: isNewCaValue } : {}

    // Build weights object
    const weight = {
        ...(values.weight !== oldItem.weight.value ? { value: Number(values.weight) } : {}),
        ...(caValue),
        ...(additionalValue)
    }

    // Calculates which tags to remove and which to add
    const pull = oldItem.tags.filter(tag => !values.tags?.includes(tag.name)).map(tag => tag.name)
    const push = values.tags?.filter(tag => !oldItem.tags.map(tag => tag.name).includes(tag)) ?? []

    // Build tags object
    const tags = {
        ...(pull.length > 0 ? { pull } : {}),
        ...(push.length > 0 ? { push } : {})
    }

    // Prepare source
    const newSourceValue = values.source === "" ? null : values.source
    const oldSourceValue = oldItem.source ? oldItem.source : null
    const source = newSourceValue !== oldSourceValue ? { source: newSourceValue } : {}

    // Prepare item data update
    const editItem: EditItemDto = {
        ...(values.name !== oldItem?.name ? { name: values.name } : {}),
        ...((Object.keys(weight).length > 0) ? { weight } : {}),
        ...(source),
        ...(values.imageFile === null ? { image: null } : {}), // Only remove image here, add logic is in CreateEdit 
        ...((Object.keys(tags).length > 0) ? { tags } : {}),
    }

    return editItem
}