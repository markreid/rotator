import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";

import "./NumericInput.css";

const NumericInput = ({
	value,
	onChange = () => {},
	displayValue,
	min = 1,
	max = 10000,
	readonly,
	disabled,
}) => {
	return (
		<Input
			sx={{ "--Input-decoratorChildHeight": "42px" }}
			startDecorator={
				<IconButton
					type="submit"
					variant="soft"
					color="primary"
					sx={{
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
					}}
					onClick={() => onChange(Math.max(min, Number(value) - 1))}
				>
					-
				</IconButton>
			}
			endDecorator={
				<IconButton
					type="submit"
					variant="soft"
					color="primary"
					sx={{
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
					}}
					onClick={() => onChange(Math.min(max, Number(value) + 1))}
				>
					+
				</IconButton>
			}
			inputMode="numeric"
			pattern="[0-9]*"
			value={displayValue === void 0 ? value : displayValue}
			onChange={(evt) => onChange(evt.target.value)}
			readOnly={!!readonly}
			disabled={!!disabled}
			size="lg"
			sx={{textAlign:'center'}}
		/>
	);
};

export default NumericInput;
