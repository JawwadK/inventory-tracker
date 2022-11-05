import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirestore } from "../contexts/FirestoreContext";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { register } = useFirestore();

	useEffect(() => {
		document.title = `Sign Up | Inventory Tracker`;
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		await register(name, email, password);
	}

	return (
		<div>
			<h1>Sign Up</h1>
			<label htmlFor="name">Full Name</label>
			<input id="name" name="name" type="text" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />
			<label htmlFor="email">E-mail</label>
			<input id="email" name="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
			<label htmlFor="password">Password</label>
			<input id="password" name="password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
			<button onClick={handleSubmit}>Sign Up</button>
			<div>
				Already have an account?
				<Link to="/login" style={{ textDecoration: "none" }}>
					<button>Sign In</button>
				</Link>
			</div>
		</div>
	);
}
