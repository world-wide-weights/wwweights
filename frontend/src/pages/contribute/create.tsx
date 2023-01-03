import { Form, Formik } from "formik";
import Head from "next/head";
import { Button } from "../../components/Button/Button";
import { Dropdown } from "../../components/Form/Dropdown/Dropdown";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { Headline } from "../../components/Headline/Headline";
import { routes } from "../../services/routes/routes";
import { Tag } from "../tags";
import { NextPageCustomProps } from "../_app";

type CreateItemDto = {
    name: string
    weight: number | string
    unit: string // TODO (Zoe-Bot): define units
    additional?: number | string
    isCa: boolean
    source?: string
    image?: string
    tags: Tag[]
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

    // Formik Form Initial Values
    const initialFormValues: CreateItemDto = {
        name: "",
        weight: "",
        unit: "g",
        additional: "",
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
                    <div className="bg-white rounded-lg py-6 px-5 mb-4">
                        <div className="lg:w-3/4 2xl:w-1/2">
                            <Headline level={3} hasMargin={false}>General Information</Headline>
                            <p className="mb-4">Give us some general info about the item so. These ones are needed for contribution. If this is approved by us it will be listed public.</p>

                            <TextInput name="name" labelText="Name" labelRequired placeholder="apple" />

                            <div className="md:flex items-end justify-between gap-3">
                                <div className="md:w-1/5">
                                    <Dropdown name="isCa" labelText="Weight" labelRequired options={weightIsCaOptions} hasMargin light />
                                </div>
                                <div className="md:w-1/4 lg:w-1/4">
                                    <TextInput type="number" min={0} name="weight" placeholder="150" />
                                </div>
                                <div className="flex justify-center md:items-center md:h-[72px]"><span>-</span></div>
                                <div className="md:w-1/4 lg:w-1/4">
                                    <TextInput type="number" min={0} name="additional" placeholder="300" />
                                </div>
                                <div className="md:w-1/4 lg:w-1/4">
                                    <Dropdown name="unit" options={unitTypeDropdownOptions} hasMargin light />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">Leave additional weight empty when it is an exact value.</p>

                        </div>
                    </div>
                    <div className="bg-white rounded-lg py-6 px-5 mb-4">
                        <Headline level={3} hasMargin={false}>Add more details</Headline>
                        <p>Add Image, tags and a source to help verify this item.</p>
                    </div>
                    <div className="lg:flex justify-between bg-white rounded-lg py-6 px-5">
                        <div className="md:flex items-center mb-3 lg:mb-0">
                            <p className="mr-2">We will give you Feedback about the Status in the profile history.</p>
                            {/* TODO (Zoe-Bot): Add link here */}
                            <Button isColored kind="tertiary">Learn more</Button>
                        </div>
                        <div className="md:flex gap-3 items-center">
                            <Button to={routes.weights.list()} isColored kind="secondary" className="mb-2 md:mb-0">Cancel</Button>
                            <Button type="submit" isColored>Create</Button>
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

