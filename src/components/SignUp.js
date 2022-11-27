import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirestore } from "../contexts/FirestoreContext";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const { register } = useFirestore();

	useEffect(() => {
		document.title = `Sign Up | Inventory Tracker`;
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		await register(name, email, password);
	}

	function validatePassword(target) {
		if (password !== password2) {
			target.setCustomValidity("Passwords don't match");
		} else {
			target.setCustomValidity("");
		}
	}

	return (
		<div className="flex items-center rounded-md justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white ">
			<div className="w-full max-w-md space-y-8">
				<div>
					<img className="mx-auto h-12 w-auto" src="inventory-tracker-512x512.png" alt="Inventory Tracker" />
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Signup to create an account</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Already have an account?
						<Link to="/login" className="font-medium mx-1 text-indigo-600 hover:text-indigo-500">
							Login
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input type="hidden" name="remember" defaultValue="true" />
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<label htmlFor="name" className="sr-only">
								Full name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 my-3 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder="Full Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="email-address" className="sr-only">
								Email address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 my-3 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 my-3 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<div>
							<label htmlFor="password2" className="sr-only">
								Confirm Password
							</label>
							<input
								id="password2"
								name="password2"
								type="password"
								autoComplete="confirm-new-password"
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 my-3 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder="Confirm password"
								value={password2}
								onKeyUp={(e) => validatePassword(e.target)}
								onChange={(e) => setPassword2(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
