import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

import "./Palette.css";

const COLOURS = ["--c1", "--c2", "--c3", "--c4", "--c5", "--on", "--onlight", "--ondark", "--off", "--offlight", "--offdark"];

const Palette = () => {
	return (
		<Sheet>
			<Card variant="plain">
				<Typography level="h1">Palette</Typography>
			</Card>
			<List>
				{COLOURS.map((name) => (
					<ListItem key={name} sx={{ gap: 2, py: 1, px: 1.5 }}>
						<div
							className={`Palette-swatch${name}`}
							style={{
								width: 48,
								height: 48,
								borderRadius: 8,
								flexShrink: 0,
								border: "1px solid rgba(0,0,0,0.1)",
							}}
						/>
						<Typography level="body-sm" fontWeight="lg" fontFamily="monospace">
							{name}
						</Typography>
					</ListItem>
				))}
			</List>
		</Sheet>
	);
};

export default Palette;
