import "react";

// TODO: move to src/

declare module 'react' {
    export interface HTMLAttributes<T> {
        datacy?: string
    }
}