import axios from "axios"
import BigNumber from "bignumber.js"
import { Form, Formik, FormikProps } from "formik"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { array, mixed, number, object, ref, SchemaOf, string } from "yup"
import { Button } from "../../components/Button/Button"
import { IconButton } from "../../components/Button/IconButton"
import { FormError } from "../../components/Errors/FormError"
import { CheckboxList } from "../../components/Form/CheckboxList/CheckboxList"
import { CustomSelectionButton } from "../../components/Form/CustomSelectionButton/CustomSelectionButton"
import { Dropdown } from "../../components/Form/Dropdown/Dropdown"
import { Label } from "../../components/Form/Label"
import { TextInput } from "../../components/Form/TextInput/TextInput"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { Seo } from "../../components/Seo/Seo"
import { Tooltip } from "../../components/Tooltip/Tooltip"
import { commandRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { convertAnyWeightIntoGram } from "../../services/unit/unitConverter"
import { Weight } from "../../types/item"
import { NextPageCustomProps } from "../_app"

type CreateItemForm = {
    name: string
    weight: number | string
    unit: "g" | "kg" | "T"
    additionalValue?: number | string
    isCa: boolean[]
    valueType: "exact" | "range"
    source?: string
    image?: string
    tags?: string
}

type CreateItemDto = {
    name: string
    weight: Weight
    source?: string
    image?: string
    tags?: string[]
}

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

/**
 * Create new items on this page.
 */
const Create: NextPageCustomProps = () => {
    // Local state
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    const { data: session } = useSession()
    const router = useRouter()

    // Formik Form Initial Values
    const initialFormValues: CreateItemForm = {
        name: "",
        weight: "",
        unit: "g",
        valueType: "exact",
        additionalValue: "",
        isCa: [false],
        source: "",
        image: "",
        tags: ""
    }

    // Formik Form Validation
    const validationSchema: SchemaOf<CreateItemForm> = object().shape({
        name: string().required("Name is required."),
        weight: number().required("Weight is required."),
        unit: mixed().oneOf(["g", "kg", "t"]),
        valueType: mixed().oneOf(["exact", "range"]),
        additionalValue: number().when("valueType", {
            is: "range",
            then: number().required("Additional value is required.").moreThan(ref("weight"), "Additional value must be greater than weight.")
        }),
        isCa: array(),
        source: string(),
        image: string(),
        tags: string(),
    })

    /**
     * Handle submit create item.
     * @param values input from form
     */
    const onFormSubmit = async ({ name, weight, unit, additionalValue, valueType, isCa, source, image, tags }: CreateItemForm) => {
        // Convert weight in g
        weight = convertAnyWeightIntoGram(new BigNumber(weight), unit).toNumber()

        // Convert additionalValue in g
        additionalValue = additionalValue ? convertAnyWeightIntoGram(new BigNumber(additionalValue), unit).toNumber() : undefined

        // Prepare item data
        const item: CreateItemDto = {
            name,
            weight: {
                value: weight,
                isCa: isCa[0],
                // Only add additionalValue when defined and value type is additional
                ...(additionalValue && (valueType === "range") ? { additionalValue } : {})
            },
            ...(image !== "" ? { image } : {}), // Only add image when defined
            ...(source !== "" ? { source } : {}), // Only add source when defined
            tags: tags ? tags.split(",") : []
        }

        try {
            // Create item with api
            // TODO: Add auth here
            const response = await commandRequest.post("/items/insert", item)

            if (response.status === 200) {
                // Redirect to discover
                router.push(routes.weights.list())
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

        <main className="mt-5">
            <div className="container">
                {/* Headline */}
                <Tooltip position="right" content="Hello">
                    <Headline>Create new item</Headline>
                </Tooltip>
            </div>

            {/* Content */}
            <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
                {({ dirty, isValid, errors, values, setFieldValue }: FormikProps<CreateItemForm>) => (
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
                                        <p> be displayed for example as ca. 300 g.</p>
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
                                        <p>Add Image, tags and a source to help verify this item.</p>
                                    </div>
                                    <Tooltip wrapperClassname="ml-3" content="Expand Details">
                                        <IconButton icon="expand_more" iconClassName="text-3xl md:text-5xl" className={`transform-gpu transition-transform duration-200 ease-linear min-w-[40px] md:w-12 h-10 md:h-12 ${isOpenDetails ? "-rotate-180" : "rotate-0"}`} />
                                    </Tooltip>
                                </div>

                                {isOpenDetails && <div className="mt-4">
                                    {/* Source */}
                                    <TextInput name="source" labelText="Source" placeholder="Link to source" />

                                    {/* TODO (Zoe-bot): Add tags design */}
                                    {/* Source */}
                                    <TextInput name="tags" labelText="Tags" helperText="Tags seperated with commas." placeholder="Tags of item" />

                                    {/* TODO (Zoe-bot): Add image upload */}
                                    {/* Image */}
                                    <TextInput name="image" labelText="Image Url" placeholder="Image of item" />
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
                                    <Button datacy="create-submit-button" disabled={!(dirty && isValid)} type="submit" isColored>Create</Button>
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

