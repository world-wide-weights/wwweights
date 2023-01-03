import { Form, Formik } from "formik";
import Head from "next/head";
import { Dropdown } from "../../components/Form/Dropdown/Dropdown";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { Headline } from "../../components/Headline/Headline";
import { Tag } from "../tags";
import { NextPageCustomProps } from "../_app";

type CreateItemDto = {
    name: string
    weight: string
    weightType: "exact" | "range" | "ca."
    unit: string // TODO (Zoe-Bot): define units
    additional?: string
    isCa: boolean
    source?: string
    image?: string
    tags: Tag[]
}

const weightTypeDropdownOptions = [
    {
        value: "exact",
        label: "Exact Weight",
    }, {
        value: "range",
        label: "Weight Range",
    }, {
        value: "ca.",
        label: "Approximate Weight",
    },
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
    // Formik Form Initial Values
    const initialFormValues: CreateItemDto = {
        name: "",
        weight: "",
        weightType: "exact",
        unit: "g",
        additional: "string",
        isCa: false,
        source: "",
        image: "",
        tags: []
    }

    /**
     * Handle submit create item.
     * @param values input from form
     */
    const onFormSubmit = async (values: CreateItemDto) => {
        console.log(values)
    }

    return <>
        {/* Meta Tags */}
        <Head>
            <title>Create new item - World Wide Weights</title>
        </Head>

        <main className="container mt-5">
            {/* Headline */}
            <Headline>Create new item</Headline>

            <Formik initialValues={initialFormValues} onSubmit={onFormSubmit}>
                <Form>
                    <div className="bg-white rounded-lg py-6 px-5">
                        <div className="w-1/2">
                            <Headline level={3} hasMargin={false}>General Information</Headline>
                            <p className="mb-4">Give us some general info about the item so. These ones are needed for contribution. If this is approved by us it will be listed public.</p>

                            <TextInput name="name" labelText="Name" labelRequired placeholder="apple" />

                            <div className="flex justify-between gap-3 items-end">
                                <div className="w-1/4">
                                    <TextInput name="weight" labelText="Weight" labelRequired placeholder="150" />
                                </div>
                                <div className="w-2/4">
                                    <Dropdown name="weightType" options={weightTypeDropdownOptions} hasMargin light />
                                </div>
                                <div className="w-1/4">
                                    <Dropdown name="unit" options={unitTypeDropdownOptions} hasMargin light />
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>

        </main>
    </>
}

// Sets route need to be logged in
Create.auth = {
    routeType: "protected"
}

export default Create

