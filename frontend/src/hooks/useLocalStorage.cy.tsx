import React, { useRef } from 'react';
import '../styles/global.css';
import { useLocalStorage } from './useLocalStorage';


const EXAMPLE_KEY = "example_key"
const INITIAL_VALUE = "example1"
const CHANGED_VALUE = "example1"

describe('Local Storage Custom Hook', () => {
    const ExampleInit: React.FC = () => {
        const initialRender = useRef<boolean>(true)
        const [value] = useLocalStorage<"example1" | "example2">(EXAMPLE_KEY, INITIAL_VALUE, initialRender)

        return <p>{value}</p>
    }

    const ExampleSetValue: React.FC = () => {
        const initialRender = useRef<boolean>(true)
        const [value, setValue] = useLocalStorage<"example1" | "example2">(EXAMPLE_KEY, INITIAL_VALUE, initialRender)

        return <>
            <p>{value}</p>
            <button onClick={() => setValue(CHANGED_VALUE)}>Value Change</button>
        </>
    }

    it('should set fallback value to value when nothing in localstorage', () => {
        cy.mount(<ExampleInit />)
        cy.get("p").contains(INITIAL_VALUE)
    })

    it('should update value when click update', () => {
        cy.mount(<ExampleSetValue />)
        cy.get("button").click()
        cy.get("p").contains(CHANGED_VALUE)
    })

    // TODO (Zoe-Bot): Test localstorage
})

export { };

