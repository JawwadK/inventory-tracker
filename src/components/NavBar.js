import React from "react";
import { useFirestore } from "../contexts/FirestoreContext";

export default function NavBar() {
	const { user } = useFirestore();

	return (
		<div style={{ maxHeight: "80px", display: "flex", justifyContent: "space-between" }}>
			<h1>Inventory Tracker</h1>
			<div >
				<div>{user?.name}</div>
				<img className="rounded-full" alt="logo" src={user?.photoURL} />
			</div>
		</div>
	);
}
