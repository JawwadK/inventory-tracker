import React, { useEffect, useState } from "react";
import { useFirestore } from "../contexts/FirestoreContext";

export default function AccountManagementPage() {
	const { user, deleteUser } = useFirestore();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		setName(user.name);
		setEmail(user.email);
	}, [user, setEmail, setName]);

	async function handleDelete() {
		await deleteUser(email);
	}

	return (
		<div>
			<h1>Edit Acount</h1>
			<h4>Name:</h4>
			<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
			<h4>Email:</h4>
			<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
			<button>Submit</button>
			<button onClick={handleDelete}>Delete Account</button>
		</div>
	);
}
