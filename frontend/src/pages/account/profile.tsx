import { isAxiosError } from "axios"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { object, ObjectSchema, string } from "yup"
import { AuthContext } from "../../components/Auth/Auth"
import { Button } from "../../components/Button/Button"
import { IconButton } from "../../components/Button/IconButton"
import { Card } from "../../components/Card/Card"
import { ContributionsEmptyState } from "../../components/EmptyState/ContributionsEmptyState"
import { Dropdown } from "../../components/Form/Dropdown/Dropdown"
import { Headline } from "../../components/Headline/Headline"
import { ItemListContribute } from "../../components/Item/ItemListContribute"
import { ItemPreviewGrid } from "../../components/Item/ItemPreviewGrid"
import { SkeletonLoadingProfile } from "../../components/Loading/SkeletonLoadingProfile"
import { Modal } from "../../components/Modal/Modal"
import { Pagination } from "../../components/Pagination/Pagination"
import { Seo } from "../../components/Seo/Seo"
import { Tooltip } from "../../components/Tooltip/Tooltip"
import { authRequest, commandRequest, queryClientRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { getImageUrl } from "../../services/utils/getImageUrl"
import { UserProfile } from "../../types/auth"
import { DeleteItemDTO, Item } from "../../types/item"
import { PaginatedResponse } from "../../types/pagination"
import { Statistics, StatisticsResponse } from "../../types/profile"
import Custom500 from "../500"
import { NextPageCustomProps } from "../_app"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 6
const MAX_LIMIT = 64

const deleteReasonDropdownOptions = [
    {
        value: "inappropriate",
        label: "Inappropriate item",
    }, {
        value: "duplicate",
        label: "Duplicate item",
    }, {
        value: "privacy",
        label: "Privacy concerns",
    }, {
        value: "not_relevant",
        label: "No longer relevant",
    }, {
        value: "fun_heavy",
        label: "The item became too heavy"
    }, {
        value: "other",
        label: "Other",
    },
]

/**
 * Profile page, shows user profile statistics and contributions.
 */
const Profile: NextPageCustomProps = () => {
    // Router
    const { query, isReady, replace } = useRouter()

    // Local States
    const [profile, setProfile] = useState<UserProfile | undefined>()
    const [contributions, setContributions] = useState<PaginatedResponse<Item>>({ data: [], total: 0, page: 1, limit: 10 })
    const [selectedContribution, setSelectedContribution] = useState<Item | null>(null)
    const [statistics, setStatistics] = useState<Statistics>({ totalContributions: 0, itemsCreated: 0, itemsUpdated: 0, itemsDeleted: 0 })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    // Local variables
    const isLoadingProfile = !profile || isLoading || !isReady

    // Global States
    const { getSession } = useContext(AuthContext)

    // Formik Form Initial Values
    const initialDeleteFormValues: DeleteItemDTO = {
        reason: "",
    }

    // Formik Form Validation
    const validationSchemaDelete: ObjectSchema<DeleteItemDTO> = object().shape({
        reason: string().required("Reason is required."),
    })

    // Fetch profile data
    useEffect(() => {
        // Wait till the router has finished loading
        if (!isReady) return

        const fetchProfile = async () => {
            const sessionData = await getSession()
            if (!sessionData) return

            try {
                // Get page and limit
                const page = query.page ? (() => {
                    const pageNumber = Number(query.page)
                    if (pageNumber < 1) return 1
                    return pageNumber
                })() : DEFAULT_PAGE
                const limit = query.limit ? (() => {
                    const limitNumber = Number(query.limit)
                    if (limitNumber < 1) return 1
                    if (limitNumber > MAX_LIMIT) return MAX_LIMIT
                    return limitNumber
                })() : DEFAULT_LIMIT

                // Fetch contributions, statistics and profile
                const [contributionsResponse, statisticsResponse, profileResponse] = await Promise.all([
                    queryClientRequest.get<PaginatedResponse<Item>>(`/items/list?userid=${sessionData.decodedAccessToken.id}&page=${page}&limit=${limit}`),
                    queryClientRequest.get<StatisticsResponse>(`/profiles/${sessionData.decodedAccessToken.id}/statistics`),
                    authRequest.get<UserProfile>("/profile/me", {
                        headers: {
                            "Authorization": `Bearer ${sessionData.accessToken}`
                        }
                    })
                ])

                // Prepare statistics
                const itemsCreated = statisticsResponse.data.count?.itemsCreated ?? 0
                const itemsUpdated = statisticsResponse.data.count?.itemsUpdated ?? 0
                const itemsDeleted = statisticsResponse.data.count?.itemsDeleted ?? 0
                const totalContributions = itemsCreated + itemsUpdated + itemsDeleted
                const statistics = {
                    totalContributions,
                    itemsCreated,
                    itemsUpdated,
                    itemsDeleted
                }

                setProfile(profileResponse.data)
                setContributions(contributionsResponse.data)
                setStatistics(statistics)
            } catch (error) {
                isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Our servers are feeling a bit heavy today. Please try again in a few minutes.")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [query.page, query.limit, getSession, isReady])

    /**
     * Handle Submit of the delete form.
     * @param values Form values
     */
    const onSubmitDelete = async (values: DeleteItemDTO): Promise<void> => {
        if (!selectedContribution) {
            console.warn("There is no contribution selected.")
            return
        }

        try {
            // Get session
            const session = await getSession()
            if (session === null)
                throw Error("Failed to get session.")

            // Delete contribution request
            await commandRequest.post(`/items/${selectedContribution.slug}/suggest/delete`, {
                reason: values.reason
            }, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            })

            let shouldRedirectToPreviousPage = false

            // Remove contribution from list
            setContributions(state => {
                const newContributions = state.data.filter(item => item.slug !== selectedContribution.slug)
                shouldRedirectToPreviousPage = newContributions.length === 0 && contributions.page > 1
                return {
                    ...state,
                    total: state.total - 1,
                    page: shouldRedirectToPreviousPage ? state.page - 1 : state.page,
                    data: shouldRedirectToPreviousPage ? state.data : newContributions
                }
            })

            // Update statistics
            setStatistics(state => ({
                ...state,
                itemsDeleted: state.itemsDeleted + 1,
                totalContributions: state.totalContributions + 1
            }))

            // Redirect to previous page if the last contribution on the page was deleted
            if (shouldRedirectToPreviousPage) {
                // If the last contribution on the page was deleted, redirect to the previous page
                await replace(routes.account.profile({
                    page: contributions.page - 1,
                    itemsPerPage: contributions.limit,
                    defaultItemsPerPage: DEFAULT_LIMIT
                }), undefined, { shallow: true })
            }
        } catch (error) {
            // axios.isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Netzwerk-Zeitüberschreitung")
            console.error(error)
        } finally {
            closeDeleteModal()
        }
    }

    /**
     * Open the delete modal and set selected contribution.
     * @param contribtuion 
     */
    const openDeleteModal = (contribtuion: Item) => {
        setSelectedContribution(contribtuion)
        setDeleteModalOpen(true)
    }

    /** 
     * Close the delete modal and reset selected contribution.
     */
    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedContribution(null)
    }

    if (error)
        return <Custom500 />

    if (isLoadingProfile)
        return <SkeletonLoadingProfile />

    return <>
        <Seo
            title="My Profile"
            description="Your profile page. Here you can see your contributions and statistics."
        />

        <main className="container mt-5 mb-5 md:mb-20">
            <Headline level={1}>Profile</Headline>
            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-6 lg:mb-0">
                    {/* Meta infos */}
                    <div className="flex flex-col justify-center lg:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <div className="grid items-center justify-center bg-blue-200 h-28 w-28 rounded-full mb-2">
                            <span className="text-6xl text-blue-700 font-bold mt-2">{profile.username[0].toUpperCase()}</span>
                        </div>
                        <Headline datacy="profile-username" level={3} hasMargin={false}>{profile.username}</Headline>
                        <p datacy="profile-registered-since"><>Member since {new Date(profile.createdAt).toLocaleDateString("en-US")}</></p>
                    </div>

                    {/* Statistics */}
                    <div datacy="profile-statistics-wrapper" className="flex flex-col gap-3 flex-grow">
                        <Card icon="volunteer_activism" value={statistics.totalContributions.toLocaleString("en-US")} descriptionTop="Contributions" />
                        <Card icon="weight" value={statistics.itemsCreated.toLocaleString("en-US")} descriptionTop="Items created" />
                        <Card icon="edit" value={statistics.itemsUpdated.toLocaleString("en-US")} descriptionTop="Items updated" />
                        <Card icon="close" value={statistics.itemsDeleted.toLocaleString("en-US")} descriptionTop="Items deleted" />
                    </div>
                </div>

                {/* Contributions */}
                <div className="lg:w-3/4">
                    {contributions.data.length === 0 ? <ContributionsEmptyState /> :
                        <>
                            <Headline level={4}>Contributions <small className="font-normal">{contributions.total}</small></Headline>
                            <ul datacy="profile-contributions-wrapper" className="mb-5">
                                {contributions.data.map((contribution) => <ItemListContribute {...contribution} key={contribution.slug} actions={<>
                                    <Tooltip content="Edit">
                                        <IconButton icon="edit" to={routes.contribute.edit(contribution.slug)} />
                                    </Tooltip>
                                    <Tooltip content="Delete">
                                        <IconButton datacy={`profile-delete-contribution-${contribution.slug}`} icon="delete" onClick={() => openDeleteModal(contribution)} />
                                    </Tooltip>
                                </>} />)}
                            </ul>
                            <Pagination defaultItemsPerPage={DEFAULT_LIMIT} totalItems={contributions.total} currentPage={query.page ? Number(query.page) : 1} baseRoute={routes.account.profile} itemsPerPage={contributions.limit} />
                        </>}
                </div>
            </div>

            {/* Delete Modal */}
            <Modal modalHeading="Do you really want to delete?" isOpen={isDeleteModalOpen} onDissmis={closeDeleteModal}>
                {/* Item Preview */}
                <div className="my-4">
                    <ItemPreviewGrid bgColor="bg-gray-100" imageUrl={getImageUrl(selectedContribution?.image)} {...selectedContribution!} />
                </div>
                <Formik initialValues={initialDeleteFormValues} onSubmit={onSubmitDelete} validationSchema={validationSchemaDelete}>
                    {({ dirty, isValid, isSubmitting }) => (
                        <Form>
                            {/* Delete Reasons */}
                            <Dropdown name="reason" labelText="Reason" labelRequired placeholder="Select a reason" options={deleteReasonDropdownOptions} hasMargin light />

                            {/* Buttons */}
                            <div className="flex md:justify-between flex-col md:flex-row">
                                <Button datacy="profile-cancel-button" kind="tertiary" type="button" onClick={closeDeleteModal} className="my-4 md:my-0">Oops, never mind</Button>
                                <Button datacy="profile-delete-button" kind="primary" type="submit" disabled={!(dirty && isValid)} loading={isSubmitting} icon="delete">Delete forever</Button>
                            </div>
                        </Form>)}
                </Formik>
            </Modal>
        </main>
    </>
}

// Sets route need to be logged in
Profile.auth = {
    routeType: "protected"
}

export default Profile