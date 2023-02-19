import { getImageUrl } from "./getImageUrl"

describe("getImageUrl", () => {
	it("should return image url when image is URL", () => {
		const image = "http://example.com/image.png"
		const result = getImageUrl(image)
		expect(result).to.equal(image)
	})

	it("should return image url with image service when image is not URL", () => {
		const image = "image.png"
		const result = getImageUrl(image)
		expect(result).to.equal(`${Cypress.env("PUBLIC_API_BASE_URL_IMAGE")}/serve/${image}`)
	})

	// This issue is in yup and is currently in PR (14.02.2023) https://github.com/jquense/yup/pull/1859
	it.skip("should return image url when url is localhost", () => {
		const image = "http://localhost:3000/image.png"
		const result = getImageUrl(image)
		expect(result).to.equal(image)
	})

	it("should return undefined when image is undefined", () => {
		const result = getImageUrl(undefined)
		expect(result).to.equal(undefined)
	})
})
