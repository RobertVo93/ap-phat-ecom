"use client"

import { Input } from "@/components/ui/input"
import { cn, formatNumberWithCommas, formatSystemNumber, parseSystemNumberInput } from "@/lib/utils"
import { Language } from "@/types"

type FormattedNumberBaseProps = {
	className?: string
	locale?: Language
	value?: number
}

type FormattedNumberInputProps = FormattedNumberBaseProps & {
	as: "input"
	onValueChange: (value: number) => void
	placeholder?: string
	id?: string
	disabled?: boolean
	min?: number
	max?: number
}

type FormattedNumberDivProps = FormattedNumberBaseProps & {
	as?: "div"
}

type FormattedNumberSpanProps = FormattedNumberBaseProps & {
	as?: "span"
}

type FormattedNumberProps = FormattedNumberInputProps | FormattedNumberDivProps | FormattedNumberSpanProps

const clampValue = (value: number, min?: number, max?: number): number => {
	if (min !== undefined && value < min) return min
	if (max !== undefined && value > max) return max
	return value
}

export function FormattedNumber(props: FormattedNumberProps) {
	const locale = props.locale || "vi"

	if (props.as === "input") {
		return (
			<Input
				id={props.id}
				disabled={props.disabled}
				type="text"
				className={props.className}
				placeholder={props.placeholder}
				value={!props.value ? (props.min ?? "0") : formatNumberWithCommas(props.value)}
				onChange={(e) => {
					const rawValue = e.target.value.trim()
					const parsedValue = parseSystemNumberInput(rawValue)
					props.onValueChange(clampValue(parsedValue, props.min, props.max))
				}}
			/>
		)
	}
	else if (props.as === "span") {
		return (
			<span className={cn("text-base md:text-sm", props.className)}>
				{formatSystemNumber(props.value ?? 0, locale)}
			</span>
		)
	}

	return (
		<div className={cn("w-full text-base md:text-sm", props.className)}>
			{formatSystemNumber(props.value ?? 0, locale)}
		</div>
	)
}
