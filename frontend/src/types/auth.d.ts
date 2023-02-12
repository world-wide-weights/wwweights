import { HttpStatusCode } from "axios"

export type Tokens = {
    access_token: string
    refresh_token: string
}

export type ApiAuthException = {
    statusCode: HttpStatusCode,
    message: string
}