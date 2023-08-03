import './Error.css';

import ResetButton from './ResetButton';

const Error = () => (
	<div className="Error">

		<div className="pad">
			<h2>Whoops.</h2>

			<p>Something's gone wrong.</p>
			<p>Try restarting first, and if that doesn't fix it, reset all settings.</p>

			</div>

		<ResetButton />
	</div>
);

export default Error;