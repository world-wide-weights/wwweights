import "react";

// TODO: move to src/

declare module 'react' {
    export interface HTMLAttributes<T> {
        dataCy?: string
    }
}