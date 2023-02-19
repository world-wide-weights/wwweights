/**
 * Parse JWT token and return the payload.
 * @param token the JWT token
 * @returns the payload
 */
export const parseJwt = (token: string) => {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
}