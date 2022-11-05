import React from "react";
import { useFirestore } from "../contexts/FirestoreContext";

export default function SearchPage() {
	const { logout } = useFirestore();
	return (
		<div>
			<h1>SearchPage</h1>

			<button onClick={logout}>logout</button>
		</div>
	);
}
