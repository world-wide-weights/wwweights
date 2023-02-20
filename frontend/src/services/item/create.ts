import { AxiosResponse } from "axios"
import { SessionData } from "../../types/auth"
import { CreateEditItemForm, CreateItemDto } from "../../types/item"
import { commandRequest } from "../axios/axios"

/**
 * Create a new item with api.
 * @param item the item to create
 * @param session the current session
 * @returns response from api
 */
export const createNewItemApi = async (item: CreateItemDto, session: SessionData): Promise<AxiosResponse<void>> => {
	const response = await commandRequest.post<void>("/items/insert", item, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	})
	return response
}

/**
 * Prepare item data for create item request.
 * @param values the item data from form
 * @returns item data for create item request
 */
export const prepareCreateItem = (values: CreateEditItemForm): CreateItemDto => {
	const createItem: CreateItemDto = {
		name: values.name,
		weight: {
			value: Number(values.weight),
			...(values.isCa[0] !== undefined ? { isCa: true } : {}), // Only add isCa when defined
			...(values.additionalValue && values.valueType === "range" ? { additionalValue: Number(values.additionalValue) } : {}), // Only add additionalValue when defined and value type is range
		},
		...(values.source !== "" ? { source: values.source } : {}), // Only add source when defined
		...(values.tags?.length !== 0 ? { tags: values.tags } : {}), // Only add tags when defined
	}

	return createItem
}
