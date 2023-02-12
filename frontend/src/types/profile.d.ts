type StatisticsResponse = {
    count: {
        itemsCreated?: number
        itemsUpdated?: number
        tagsUsedOnCreation?: number
        tagsUsedOnUpdate?: number
        sourceUsedOnCreation?: number
        sourceUsedOnUpdate?: number
        imageAddedOnCreation?: number
        imageAddedOnUpdate?: number
        aditionalValueOnCreation?: number
        aditionalValueOnUpdate?: number
        itemsDeleted?: number
    }
}