import "./NumericInput.css";

const NumericInput = ({
	value,
	onChange = () => {},
	displayValue,
	min = 1,
	max = 10000,
	readonly,
}) => {
	return (
		<div className="NumericInput">
			<button
				className="NumericInput-button button-first"
				onClick={() => onChange(Math.max(min, Number(value) - 1))}
			>
				-
			</button>
			<input
				inputMode="numeric"
				pattern="[0-9]*"
				className="NumericInput-input"
				value={displayValue === void 0 ? value : displayValue}
				onChange={(evt) => onChange(evt.target.value)}
				readOnly={!!readonly}
			/>
			<button
				className="NumericInput-button button-last"
				onClick={() => onChange(Math.min(max, Number(value) + 1))}
			>
				+
			</button>
		</div>
	);
};

export default NumericInput;
