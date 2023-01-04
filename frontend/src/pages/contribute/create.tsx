import { Form, Formik, FormikProps } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from 'yup';
import { Button } from "../../components/Button/Button";
import { IconButton } from "../../components/Button/IconButton";
import { FormError } from "../../components/Errors/FormError";
import { Dropdown } from "../../components/Form/Dropdown/Dropdown";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { Headline } from "../../components/Headline/Headline";
import { routes } from "../../services/routes/routes";
import { getWeightInG } from "../../services/utils/unit";
import { Weight } from "../weights";
import { NextPageCustomProps } from "../_app";

type CreateItemForm = {
    name: string
    weight: number | string
    unit: "g" | "kg" | "t" // TODO (Zoe-Bot): define units
    additionalValue?: number | string
    isCa: boolean
    source?: string
    image?: string
    tags?: string
}

type CreateItemDto = {
    name: string
    slug: string // TODO (Zoe-Bot): remove with correct api
    weight: Weight
    source?: string
    image?: string
    tags: string[]
}

const weightIsCaOptions = [
    {
        value: true,
        label: "ca.",
    }, {
        value: false,
        label: "-",
    }
]

const unitTypeDropdownOptions = [
    {
        value: "g",
        label: "g",
    }, {
        value: "kg",
        label: "kg",
    }, {
        value: "t",
        label: "t",
    },
]

/**
 * Create new items on this page.
 */
const Create: NextPageCustomProps = () => {
    // Local state
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false)

    const router = useRouter()

    // Formik Form Initial Values
    const initialFormValues: CreateItemForm = {
        name: "",
        weight: "",
        unit: "g",
        additionalValue: "",
        isCa: false,
        source: "",
        image: "",
        tags: ""
    }

    // Formik Form Validation
    const validationSchema: yup.SchemaOf<CreateItemForm> = yup.object().shape({
        name: yup.string().required("Name is required."),
        weight: yup.string().required("Weight is required."),
        unit: yup.mixed().oneOf(['g', 'kg', 't']),
        additionalValue: yup.string(),
        isCa: yup.boolean().required("IsCa is required."),
        source: yup.string(),
        image: yup.string(),
        tags: yup.string(),
    })

    /**
     * Handle submit create item.
     * @param values input from form
     */
    const onFormSubmit = async ({ name, weight, unit, additionalValue, isCa, source, image, tags }: CreateItemForm) => {
        // Prepare weight in g
        const weightNumber = parseInt(weight as string)
        const valueInG = getWeightInG(weightNumber, unit)

        // Prepare additionalValue in g
        if (additionalValue !== "") {
            const additionalValueNumber = parseInt(additionalValue as string)
            additionalValue = getWeightInG(additionalValueNumber, unit)
        }

        // Prepare item data
        const item: CreateItemDto = {
            name,
            ...(source ? { source } : {}), // Only add source when defined
            ...(image ? { image } : {}), // Only add image when defined
            slug: name, // TODO (Zoe-Bot): remove with correct api
            weight: {
                value: valueInG,
                isCa,
                ...(additionalValue ? { additionalValue } : {}) // Only add additionalValue when defined
            },
            tags: tags ? tags.split(', ') : []
        }

        // Create item with api
        fetch('http://localhost:3004/items', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Redirect to discover
        router.push(routes.weights.list())
    }

    return <>
        {/* Meta Tags */}
        <Head>
            <title>Create new item - World Wide Weights</title>
        </Head>

        <main className="container mt-5">
            {/* Headline */}
            <Headline>Create new item</Headline>

            <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
                {({ dirty, isValid, errors, touched }: FormikProps<CreateItemForm>) => (
                    <Form>
                        {/*** General Information ***/}
                        <div className="bg-white rounded-lg p-6 mb-4">
                            <div className="lg:w-3/4 2xl:w-1/2">
                                {/* General Information Header */}
                                <Headline level={3} hasMargin={false}>General Information</Headline>
                                <p className="mb-4">Give us some general info about the item so. These ones are needed for contribution. If this is approved by us it will be listed public.</p>

                                {/* Name */}
                                <TextInput name="name" labelText="Name" labelRequired placeholder="elephant" />

                                {/* Weight */}
                                <div className="md:flex items-end justify-between gap-3">
                                    <div className="md:w-1/5">
                                        <Dropdown name="isCa" labelText="Weight" labelRequired options={weightIsCaOptions} hasMargin light />
                                    </div>
                                    <div className="md:w-1/4 lg:w-1/4">
                                        <TextInput name="weight" type="number" noError min={1} placeholder="150" />
                                    </div>
                                    <div className="flex justify-center md:items-center md:h-[72px]"><span>-</span></div>
                                    <div className="md:w-1/4 lg:w-1/4">
                                        <TextInput type="number" min={0} name="additionalValue" placeholder="300" />
                                    </div>
                                    <div className="md:w-1/4 lg:w-1/4">
                                        <Dropdown name="unit" options={unitTypeDropdownOptions} hasMargin light />
                                    </div>
                                </div>
                                <FormError field="weight" />
                                {!(errors.weight && touched.weight) && <p className="text-gray-600 text-sm">Leave additional weight empty when it is an exact value.</p>}
                            </div>
                        </div>

                        {/*** Details ***/}
                        <div className="bg-white rounded-lg p-6 mb-4">
                            {/* Details Header */}
                            <div onClick={() => setIsOpenDetails(!isOpenDetails)} className="flex items-center justify-between cursor-pointer">
                                <div className="text-left">
                                    <Headline level={3} hasMargin={false}>Add more details</Headline>
                                    <p>Add Image, tags and a source to help verify this item.</p>
                                </div>
                                <IconButton icon="expand_more" iconClassName="text-5xl" className={`transform-gpu transition-transform duration-200 ease-linear w-12 h-12 ${isOpenDetails ? "-rotate-180" : "rotate-0"}`} />
                            </div>

                            {isOpenDetails && <div className="mt-4">
                                {/* Source */}
                                <TextInput name="source" labelText="Source" placeholder="https://en.wikipedia.org/wiki/Main_Page" />

                                {/* TODO (Zoe-bot): Add tags design */}
                                {/* Source */}
                                <TextInput name="tags" labelText="Tags" helperText="Tags seperated with commas." placeholder="animal, mammal,..." />

                                {/* TODO (Zoe-bot): Add image upload */}
                                {/* Image */}
                                <TextInput name="image" labelText="Image Url" placeholder="https://picsum.photos/120" />
                            </div>}
                        </div>

                        {/*** Actions ***/}
                        <div className="lg:flex justify-between bg-white rounded-lg py-6 px-5">
                            <div className="md:flex items-center mb-3 lg:mb-0">
                                <p className="mr-2">We will give you Feedback about the Status in the profile history.</p>
                                {/* TODO (Zoe-Bot): Add link here */}
                                <Button isColored kind="tertiary">Learn more</Button>
                            </div>
                            <div className="md:flex gap-3 items-center">
                                <Button to={routes.weights.list()} isColored kind="secondary" className="mb-2 md:mb-0">Cancel</Button>
                                <Button disabled={!(dirty && isValid)} type="submit" isColored>Create</Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </main>
    </>
}

// Sets route need to be logged in
Create.auth = {
    routeType: "protected"
}

export default Create

