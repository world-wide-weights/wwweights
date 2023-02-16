import axios from "axios"
import BigNumber from "bignumber.js"
import { Form, Formik, FormikProps } from "formik"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { array, boolean, mixed, number, object, ref, SchemaOf, string } from "yup"
import { AuthContext } from "../../components/Auth/Auth"
import { Button } from "../../components/Button/Button"
import { IconButton } from "../../components/Button/IconButton"
import { FormError } from "../../components/Errors/FormError"
import { CheckboxList } from "../../components/Form/CheckboxList/CheckboxList"
import { CustomSelectionButton } from "../../components/Form/CustomSelectionButton/CustomSelectionButton"
import { Dropdown } from "../../components/Form/Dropdown/Dropdown"
import { ImageUpload } from "../../components/Form/ImageUpload/ImageUpload"
import { Label } from "../../components/Form/Label"
import { ChipTextInput } from "../../components/Form/TextInput/ChipTextInput"
import { TextInput } from "../../components/Form/TextInput/TextInput"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { Seo } from "../../components/Seo/Seo"
import { Tooltip } from "../../components/Tooltip/Tooltip"
import { commandRequest, imageRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { convertAnyWeightIntoGram } from "../../services/unit/unitConverter"
import { ImageUploadResponse } from "../../types/image"
import { Weight } from "../../types/item"
import { NextPageCustomProps } from "../_app"

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

type CreateItemForm = {
    name: string
    weight: number | string
    unit: "g" | "kg" | "T"
    additionalValue?: number | string
    isCa: boolean[]
    valueType: "exact" | "range"
    source?: string
    imageFile?: File
    tags?: string[]
}

type CreateItemDto = {
    name: string
    weight: Weight
    source?: string
    image?: string
    tags?: string[]
}

/**
 * Create new items on this page.
 */
const Create: NextPageCustomProps = () => {
    // Local state
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    const router = useRouter()
    const { getSession } = useContext(AuthContext)

    // Formik Form Initial Values
    const initialFormValues: CreateItemForm = {
        name: "",
        weight: "",
        unit: "g",
        valueType: "exact",
        additionalValue: "",
        /** This is an array since checkbox component can only handle arrays */
        isCa: [false],
        source: "",
        imageFile: undefined,
        tags: []
    }

    // Formik Form Validation
    const validationSchema: SchemaOf<CreateItemForm> = object().shape({
        name: string().required("Name is required."),
        weight: number().required("Weight is required."),
        unit: mixed().oneOf(unitTypeDropdownOptions.map(option => option.value)),
        valueType: mixed().oneOf(["exact", "range"]),
        additionalValue: number().when("valueType", {
            is: "range",
            then: number().required("Additional value is required.").moreThan(ref("weight"), "Additional value must be greater than weight.")
        }),
        isCa: array().of(boolean()).notRequired(),
        source: string(),
        imageFile: mixed().notRequired(),
        tags: array().of(string().min(5).max(255)).notRequired(),
    })

    /**
     * Handle submit create item.
     * @param values input from form
     */
    const onFormSubmit = async ({ name, weight, unit, additionalValue, valueType, isCa, source, tags, imageFile }: CreateItemForm) => {

        // Convert weight in g
        weight = convertAnyWeightIntoGram(new BigNumber(weight), unit).toNumber()

        // Convert additionalValue in g
        additionalValue = additionalValue ? convertAnyWeightIntoGram(new BigNumber(additionalValue), unit).toNumber() : undefined

        console.log({
            message: "Weights converted to g."
        })

        // Prepare item data
        const item: CreateItemDto = {
            name,
            weight: {
                value: weight,
                isCa: isCa[0],
                // Only add additionalValue when defined and value type is additional
                ...(additionalValue && (valueType === "range") ? { additionalValue } : {})
            },
            ...(source !== "" ? { source } : {}), // Only add source when defined
            tags: tags // TODO: Replace with array tags
        }

        console.log({
            message: "Item data prepared.",
        })

        try {
            const session = await getSession()

            if (session === null)
                throw Error("Failed to get session.")

            console.log({
                message: "Session retrieved.",
            })
            if (imageFile) {
                console.log({
                    message: "Image file found. Trying to upload image.",
                })
                // Create form and append image
                const formData = new FormData()
                formData.append("image", imageFile)

                const imageResponse = await imageRequest.post<ImageUploadResponse>("/upload/image", formData, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        "Content-Type": "multipart/form-data"
                    },
                    validateStatus(status) {
                        // Accept 409 Conflict as valid status
                        return (status >= 200 && status < 300) || status === 409
                    },
                })

                // Append image path to item
                item.image = imageResponse.data.path
                console.log({
                    message: "Image uploaded.",
                })
            }

            console.log({
                message: "Trying to create item.",
            })


            // Create item with api
            const response = await commandRequest.post("/items/insert", item, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            })

            console.log({
                message: "Item created. Redirecting to discover.",
            })

            if (response.status === 200) {
                // Redirect to discover
                await router.push(routes.weights.list())
            }
        } catch (error) {
            axios.isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Netzwerk-Zeitüberschreitung")
            return
        }
    }

    return <>
        {/* Meta Tags */}
        <Seo
            title="Create new item"
            description="Contribute to the World Wide Weights database and create a new item."
        />

        <main className="mt-5 mb-5 md:mb-20">
            <div className="container">
                {/* Headline */}
                <Headline>Create new item</Headline>
            </div>

            {/* Content */}
            <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
                {({ dirty, isValid, errors, values, setFieldValue, isSubmitting }: FormikProps<CreateItemForm>) => (
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
                                        <CustomSelectionButton datacy="create-select-button-exact" active={values.valueType === "exact"} onClick={() => setFieldValue("valueType", "exact")} headline="Exact Value" description="150 kg" />
                                        <CustomSelectionButton datacy="create-select-button-range" active={values.valueType === "range"} onClick={() => setFieldValue("valueType", "range")} headline="Range Value" description="150 - 200 kg" />
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
                                    <div className="mt-[-10px]">
                                        <FormError field="weight" />
                                    </div>
                                    <div>
                                        <FormError field="additionalValue" />
                                    </div>
                                </div>

                                {/* Is circa */}
                                <div className={`${errors.weight ? "mt-2" : ""} flex items-center`}>
                                    <CheckboxList name="isCa" options={[{ value: true, label: "is circa" }]} />
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
                                <div onClick={() => setIsOpenDetails(!isOpenDetails)} datacy="create-open-details-button" className="flex items-center justify-between cursor-pointer">
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
                                    <ImageUpload name="imageFile" />

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
                                    <Button datacy="create-submit-button" disabled={!(dirty && isValid)} type="submit" icon="add" loading={isSubmitting} isColored>Create</Button>
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

// Sets route need to be logged in
Create.auth = {
    routeType: "protected"
}

export default Create

