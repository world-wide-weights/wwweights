import axios from "axios"
import BigNumber from "bignumber.js"
import { Form, Formik, FormikProps } from "formik"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { array, mixed, number, object, ref, SchemaOf, string } from "yup"
import { createNewItemApi, prepareCreateItem } from "../../services/item/create"
import { editItemApi, prepareEditItem } from "../../services/item/edit"
import { uploadImageApi } from "../../services/item/image"
import { routes } from "../../services/routes/routes"
import { convertAnyWeightIntoGram } from "../../services/unit/unitConverter"
import { CreateEditItemForm, CreateItemDto, EditItemDto, Item } from "../../types/item"
import { AuthContext } from "../Auth/Auth"
import { Button } from "../Button/Button"
import { IconButton } from "../Button/IconButton"
import { FormError } from "../Errors/FormError"
import { CheckboxList } from "../Form/CheckboxList/CheckboxList"
import { CustomSelectionButton } from "../Form/CustomSelectionButton/CustomSelectionButton"
import { Dropdown } from "../Form/Dropdown/Dropdown"
import { ImageUpload } from "../Form/ImageUpload/ImageUpload"
import { Label } from "../Form/Label"
import { ChipTextInput } from "../Form/TextInput/ChipTextInput"
import { TextInput } from "../Form/TextInput/TextInput"
import { Headline } from "../Headline/Headline"
import { Icon } from "../Icon/Icon"
import { Tooltip } from "../Tooltip/Tooltip"

const unitTypeDropdownOptions = [
    {
        value: "g",
        label: "g",
    }, {
        value: "kg",
        label: "kg",
    }, {
        value: "T",
        label: "T",
    },
]

type CreateEditProps = {
    /** Item to edit. If undefined, a new item will be created. */
    item?: Item
}

/**
 * Create new items on this page.
 */
export const CreateEdit: React.FC<CreateEditProps> = ({ item }) => {
    // Local state
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    const router = useRouter()
    const { getSession } = useContext(AuthContext)

    const isEditMode = item

    // Formik Form Initial Values
    const initialFormValues: CreateEditItemForm = {
        name: item?.name ?? "",
        weight: item?.weight.value ?? "",
        unit: "g",
        valueType: item?.weight.additionalValue ? "range" : "exact",
        additionalValue: item?.weight.additionalValue ?? "",
        isCa: item?.weight.isCa ? ["isCa"] : [], // This is an array since checkbox component can only handle arrays
        source: item?.source ?? "",
        imageFile: undefined, // The edit initial is at the image upload component
        tags: item?.tags.map(tag => tag.name) ?? []
    }

    // Formik Form Validation
    const validationSchema: SchemaOf<CreateEditItemForm> = object().shape({
        name: string().required("Name is required."),
        weight: number().required("Weight is required."),
        unit: mixed().oneOf(unitTypeDropdownOptions.map(option => option.value)),
        valueType: mixed().oneOf(["exact", "range"]),
        additionalValue: number().when("valueType", {
            is: "range",
            then: number().required("Additional value is required.").moreThan(ref("weight"), "Additional value must be greater than weight.")
        }),
        isCa: array().of(string()).notRequired(),
        source: string(),
        imageFile: mixed().notRequired(),
        tags: array().of(string().min(2).max(255)).notRequired(),
    })

    /**
     * Handle submit create item.
     * @param values input from form
     */
    const onFormSubmit = async (values: CreateEditItemForm) => {
        // Convert weight in g
        values.weight = convertAnyWeightIntoGram(new BigNumber(values.weight), values.unit).toNumber()

        // Convert additionalValue in g
        values.additionalValue = values.additionalValue ? convertAnyWeightIntoGram(new BigNumber(values.additionalValue), values.unit).toNumber() : undefined

        // Dtos
        let createItem: CreateItemDto | null = null
        let editItem: EditItemDto | null = null

        // Prepare create item
        if (!isEditMode)
            createItem = prepareCreateItem(values)

        // Prepare edit item
        if (isEditMode)
            editItem = prepareEditItem(values, item)

        try {
            /** Get session */
            const session = await getSession()
            if (session === null)
                throw Error("Failed to get session.")

            /** Image Upload */
            if (values.imageFile) {
                const imageUploadResponse = await uploadImageApi(values.imageFile, session)

                // Append image path to item create
                if (!isEditMode && createItem)
                    createItem.image = imageUploadResponse.data.path

                // Append image path to item edit
                if (isEditMode && editItem)
                    editItem.image = imageUploadResponse.data.path
            }

            /** Item fetches */
            let response

            /** Create item with api */
            if (!isEditMode && createItem)
                response = await createNewItemApi(createItem, session)

            /** Update item with api */
            if (isEditMode && editItem)
                response = await editItemApi(item?.slug, editItem, session)

            /** Redirect to discover */
            if (response?.status === 200)
                await router.push(routes.weights.list())
        } catch (error) {
            axios.isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Our servers are feeling a bit heavy today. Please try again in a few minutes.")
            return
        }
    }

    return <>
        <main className="mt-5 mb-5 md:mb-20">
            <div className="container">
                {/* Headline */}
                <Headline>{isEditMode ? `Edit ${item.name}` : "Create new item"}</Headline>
            </div>

            {/* Content */}
            <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
                {({ dirty, isValid, errors, values, setFieldValue, isSubmitting }: FormikProps<CreateEditItemForm>) => (
                    <Form>
                        <div className="container">
                            {/*** General Information ***/}
                            <div className="bg-white rounded-lg p-6 mb-4">
                                <div className="lg:w-3/4 2xl:w-1/2">
                                    {/* Name */}
                                    <TextInput name="name" labelText="Name" labelRequired placeholder="Name of item" />

                                    {/* Weight */}
                                    <Label name="" labelText="Weight" labelRequired></Label>
                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                        <CustomSelectionButton datacy="createedit-select-button-exact" active={values.valueType === "exact"} onClick={() => setFieldValue("valueType", "exact")} headline="Exact Value" description="150 kg" />
                                        <CustomSelectionButton datacy="createedit-select-button-range" active={values.valueType === "range"} onClick={() => setFieldValue("valueType", "range")} headline="Range Value" description="150 - 200 kg" />
                                    </div>
                                    <div className={`grid ${values.valueType === "exact" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-[1fr_16px_1fr] md:grid-cols-[1fr_8px_1fr_128px]"} md:gap-3`}>
                                        {/** Exact Value **/}
                                        <div className="min-w-0">
                                            <TextInput name="weight" type="number" noError min={1} placeholder="150" />
                                        </div>

                                        {/** Additional Value **/}
                                        {values.valueType === "range" && <>
                                            <div className="flex justify-center items-center mb-2 md:mb-3"><Icon className="text-base text-gray-700">remove</Icon></div>
                                            <div className="min-w-0">
                                                <TextInput type="number" min={0} noError name="additionalValue" placeholder="300" />
                                            </div>
                                        </>}

                                        {/** Unit **/}
                                        <div className={`col-start-1 col-end-4 md:row-start-1 ${values.valueType === "exact" ? "md:col-start-2 md:w-32" : "md:col-start-4 md:col-end-6"}`}>
                                            <Dropdown name="unit" options={unitTypeDropdownOptions} hasMargin light />
                                        </div>
                                    </div>

                                    {/** Errors Weight **/}
                                    <div className="mt-[-10px]">
                                        <FormError field="weight" />
                                    </div>
                                    <div>
                                        <FormError field="additionalValue" />
                                    </div>
                                </div>

                                {/* Is circa */}
                                <div className={`${errors.weight ? "mt-2" : ""} flex items-center`}>
                                    <CheckboxList name="isCa" options={[{ value: "isCa", label: "is circa" }]} />
                                    <Tooltip wrapperClassname="cursor-help" position="right" content={<>
                                        <p>When checked it is a circa value and will</p>
                                        <p>be displayed for example as ca. 300 g.</p>
                                    </>}>
                                        <Icon className="text-xl text-gray-600 ml-2">info</Icon>
                                    </Tooltip>
                                </div>
                            </div>

                            {/*** Details ***/}
                            <div className="bg-white rounded-lg p-6 mb-4">
                                {/* Details Header */}
                                <div onClick={() => setIsOpenDetails(!isOpenDetails)} datacy="createedit-open-details-button" className="flex items-center justify-between cursor-pointer">
                                    <div className="text-left">
                                        <Headline level={3} hasMargin={false}>Add more details</Headline>
                                        <p>Add tags, image and a source to help verify this item.</p>
                                    </div>
                                    <Tooltip wrapperClassname="ml-3" content="Expand Details">
                                        <IconButton icon="expand_more" iconClassName="text-3xl md:text-5xl" className={`transform-gpu transition-transform duration-200 ease-linear min-w-[40px] md:w-12 h-10 md:h-12 ${isOpenDetails ? "-rotate-180" : "rotate-0"}`} />
                                    </Tooltip>
                                </div>

                                {isOpenDetails && <div className="mt-4">
                                    {/* Tags */}
                                    <ChipTextInput name="tags" labelText="Tags" helperText="Tags are seperated with commas." />

                                    {/* Image */}
                                    <Label name="imageFile" labelText={"Image"} />
                                    <ImageUpload name="imageFile" filePath={item?.image} />

                                    {/* Source */}
                                    <TextInput name="source" labelText="Source of weight" placeholder="Link to source" />
                                </div>}
                            </div>
                        </div>

                        {/*** Actions Text Mobile ***/}
                        <div className="container">
                            <p className="block sm:hidden">We will give you Feedback about the Status in the profile.</p>
                        </div>

                        {/*** Actions ***/}
                        <div className="sm:container">
                            <div className="fixed w-full sm:static bottom-0 lg:flex items-center justify-between bg-white border-t border-gray-100 sm:rounded-lg py-6 px-5">
                                <p className="hidden sm:block mb-2 lg:mb-0">We will give you Feedback about the Status in the profile.</p>
                                <div className="flex gap-3 items-center">
                                    <Button to={routes.weights.list()} isColored kind="secondary">Cancel</Button>
                                    <Button datacy="submit-button" disabled={!(dirty && isValid)} type="submit" icon={isEditMode ? "edit" : "add"} loading={isSubmitting} isColored>{isEditMode ? "Edit" : "Create"}</Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            {/* TODO (Zoe-Bot): Add correct error handling */}
            <div className="container">
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </main >
    </>
}
