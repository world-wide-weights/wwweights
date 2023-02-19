export type NavLink = {
	shouldDisplay: boolean
	text: string
} & (
	| {
			to: string
	  }
	| {
			onClick: () => void
	  }
)
