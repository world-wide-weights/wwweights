import { Field, FieldArray, useFormikContext } from "formik"
import React, { Fragment } from "react"
import { Chip } from "../../Chip/Chip"
import { FormError } from "../../Errors/FormError"

type ChipTextInputProps = {
  /** Gives the input a unique name */
  name: string
}

/**
 * Chip Text Input, can only be used with Formik
 * Text input with chips
 */
export const ChipTextInput: React.FC<ChipTextInputProps> = ({ name }) => {
  // Returns true if the input is selected
  const [isInputSelected, setIsInputSelected] = React.useState(false)
  // Removes a chip from the textfield if the user clicks on the x Icon
  // const removeTags = (indexToRemove: number) => {
  //   setTags([...tags.filter((_, index) => index !== indexToRemove)])
  // }
  // Adds a chip to the textfield if the user presses enter
  // const addChips = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     const value = (event.target as HTMLInputElement).value
  //     if (value !== "") {
  //       setTags([...tags, value])
  //       selectedChips([...tags, value]);
  //       (event.target as HTMLInputElement).value = ""
  //     }
  //   }
  // }
  const { values } = useFormikContext<any>()

  return (<>
    <FieldArray name={name}>{(arrayHelpers) => {

      const removeTags = (indexToRemove: number) => {
        arrayHelpers.remove(indexToRemove)
      }

      const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const submitKeys = ["Enter", ","]
        if (!submitKeys.includes(event.key))
          return
        const tagInput = (event.target as HTMLInputElement)

        const tagValue = tagInput.value.split(",")
        tagValue.forEach((tag) => {
          if (tag.trim() !== "") {
            arrayHelpers.push(tag.trim())
          }
        })
        tagInput.value = ""
      }

      const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && event.currentTarget.value === "")
          arrayHelpers.pop()
      }

      return <>
        {values[name] && values[name].map((tag: string, index: number) => <Fragment key={index}>
          <Field name={`${name}.${index}`}>
            {(props: any) => <>
              <input className="hidden" />
              <Chip key={index} onClick={() => removeTags(index)}>{tag}</Chip>
              <FormError field={`${name}.${index}`} />
            </>}
          </Field>
        </Fragment>)}
        <input onKeyDown={onKeyDown} onKeyUp={addTag}></input>
        <input></input>
      </>
    }}
    </FieldArray>
    {/* <>{(props: FieldProps<any>) => (
      <>
        <div datacy="chip-text-input" className={`flex bg-gray-100 rounded-lg ${isInputSelected ? "outline outline-2 outline-blue-500" : ""}`}>
          <div className="flex flex-wrap pr-4 border-solid pl-4">
            <ul datacy="tags-list" className="flex flex-wrap mt-2">
              {tags.map((tag, index) => (
                <li key={index} className=" w-auto h-8 flex items-center content-center text-blue-600 pl-2 pr-2 text-sm list-none rounded-full mr-2 mb-2 bg-blue-500 bg-opacity-20">
                  <span className="mt-0.5">{tag}</span>
                  <span onClick={() => removeTags(index)}>
                    <Icon className="block w-4 leading-4 text-center text-white text-sm ml-2 rounded-full cursor-pointer bg-blue-500" >{"close"}</Icon>
                  </span>
                </li>
              ))}
            </ul>
            <input
              className="flex-1 h-12 pr-2 text-base text-gray-500 bg-gray-100 focus-visible:outline-none"
              type=""
              onKeyUp={addChips}
              onFocus={() => setIsInputSelected(true)}
              onBlur={() => setIsInputSelected(false)}
              placeholder="Press enter to add tags"
            />
          </div>
        </div>
      </>

    )}</> */}</>
  )
}