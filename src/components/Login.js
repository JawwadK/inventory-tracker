import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirestore } from "../contexts/FirestoreContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useFirestore();

	useEffect(() => {
		document.title = `Login | Inventory Tracker`;
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		await login(email, password);
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Login</h1>
				<label htmlFor="email">E-mail</label>
				<input id="email" name="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
				<button>Login</button>
			</form>
			<div>
				Don't have an account?
				<Link to="/signup" style={{ textDecoration: "none" }}>
					<button className="formFieldButton2">Join Now</button>
				</Link>
			</div>
		</div>
	);
}
