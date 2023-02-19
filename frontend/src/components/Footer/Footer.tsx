import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import logo from "../../../public/logo.png"
import discord from "../../assets/img/logos_icons/discord.svg"
import github from "../../assets/img/logos_icons/github.svg"
import twitter from "../../assets/img/logos_icons/twitter.svg"
import { queryClientRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { NavLink } from "../../types/nav"
import { PaginatedResponse } from "../../types/paginated"
import { Tag } from "../../types/tag"
import { AuthContext } from "../Auth/Auth"
import { Button } from "../Button/Button"
import { Headline } from "../Headline/Headline"
import { Tooltip } from "../Tooltip/Tooltip"

/**
 * Footer
 */
export const Footer: React.FC = () => {
	const router = useRouter()

	// Local States
	const [tags, setTags] = useState<Tag[]>([])

	// Global states
	const { hasSession, logout, isLoading } = useContext(AuthContext)

	const aboutLinks: NavLink[] = [{
		shouldDisplay: true,
		to: routes.weights.list(),
		text: "Discover items",
	}, {
		shouldDisplay: true,
		to: routes.contribute.create,
		text: "Create item",
	}, {
		shouldDisplay: hasSession,
		to: routes.account.profile(),
		text: "My Profile",
	}, {
		shouldDisplay: !hasSession,
		to: routes.account.login + "?callbackUrl=" + router.asPath,
		text: "Login",
	}, {
		shouldDisplay: !hasSession,
		to: routes.account.register + "?callbackUrl=" + router.asPath,
		text: "Register",
	}, {
		shouldDisplay: hasSession,
		onClick: () => logout(),
		text: "Logout"
	}]

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const responseTags = await queryClientRequest.get<PaginatedResponse<Tag>>("/tags/list?page=1&limit=5&sort=most-used")
				const tags = responseTags.data.data
				setTags(tags)
			} catch (error) {
				// Display no error message here to the user since it's not mandatory
				console.log(error)
				return
			}
		}
		fetchTags()
	}, [])

	return <footer className="bg-white mt-5">
		<div className="container pt-10">
			<div className="flex flex-col lg:flex-row justify-between mb-4 lg:mb-0">
				<div className="md:w-2/3 lg:w-1/3 mb-4">
					{/* Logo */}
					<Link className="flex items-center mb-2" href={routes.home}>
						<Image src={logo} alt="Logo" className="min-w-[25px] w-[25px] mr-2" />
						<h6 className="font-bold text-lg text-blue-500">World Wide Weights</h6>
					</Link>

					<p className="text-gray-700 text-sm md:text-base mb-2">World&apos;s largest database of weights! World Wide Weights is a community project to create a global database of weights.</p>

					{/* Social Links */}
					<div className="flex items-center gap-3 mb-4">
						<Tooltip content="Link to our discord server!">
							<a href="https://discord.gg/UmxWf2FEQx" target="_blank" rel="noreferrer noopener">
								<Image src={discord} alt="Image of Discord Logo" width={25} />
							</a>
						</Tooltip>
						<Tooltip content="Link to our GitHub Orga!">
							<a href="https://github.com/world-wide-weights" target="_blank" rel="noreferrer noopener">
								<Image src={github} alt="Image of Github Logo" width={25} />
							</a>
						</Tooltip>
						<Tooltip content="Link to our Twitter!">
							<a href="https://twitter.com/wwweights" target="_blank" rel="noreferrer noopener">
								<Image src={twitter} alt="Image of Twitter logo" width={25} />
							</a>
						</Tooltip>
					</div>
				</div>
				<div className="mb-4">
					<Headline className="text-gray-900" level={4} hasMargin={false}>Links</Headline>
					<ul className="text-sm md:text-base ">
						{!isLoading && aboutLinks.map((aboutLink, index) => aboutLink.shouldDisplay && <li key={index}>
							<Button {...aboutLink} kind="tertiary">
								{aboutLink.text}
							</Button>
						</li>)}
					</ul>
				</div>
				<div className="mb-4">
					<Headline className="text-gray-900" level={4} hasMargin={false}>Tags</Headline>
					<ul className="text-sm md:text-base ">
						{tags.map((tag, index) => <li key={index}>
							<Button to={routes.tags.single(tag.name)} kind="tertiary">{`${tag.name} (${tag.count})`}</Button>
						</li>)}
						<li><Button to={routes.tags.list()} kind="tertiary">All tags</Button></li>
					</ul>
				</div>
				<div className="mb-4">
					<Headline className="text-gray-900" level={4} hasMargin={false}>Misc</Headline>
					<ul className="text-sm md:text-base ">
						<li><Button to={routes.misc.index} kind="tertiary">Help Center</Button></li>
						<li><Button to={routes.misc.contact} kind="tertiary">Contact Us</Button></li>
						<li><Button to={routes.misc.privacy} kind="tertiary">Privacy Policy</Button></li>
						<li><Button to={routes.misc.terms} kind="tertiary">Terms and Conditions</Button></li>
					</ul>
				</div>
			</div>
		</div>
		<div className="border-t py-5">
			<div className="container flex items-center justify-center">
				{/* Copyright */}
				<span className="text-gray-600 text-sm md:text-base mr-0 md:mr-3">World Wide Weights Copyright © {new Date().getFullYear()}. All rights reserved.</span>
			</div>
		</div>
	</footer >
}
