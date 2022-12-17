import "react";

declare module 'react' {
    export interface HTMLAttributes<T> {
        datacy?: string
    }
}