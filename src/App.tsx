import React from "react";
import classnames from "classnames";
import "./App.scss";
import { SignUpForm } from "./components/SignUpForm";

const App = () => {
	return (
		<div className={classnames("main")}>
			<div className={classnames("container", 'p-4')}>
        <SignUpForm />
			</div>
		</div>
	);
};

export default App;
