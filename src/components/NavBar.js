import React from "react";
import { Link } from "react-router-dom";
import { useFirestore } from "../contexts/FirestoreContext";

export default function NavBar() {
	const { user } = useFirestore();

	return (
		<div style={{ maxHeight: "80px", display: "flex", justifyContent: "space-between" }}>
			<h1>Inventory Tracker</h1>
			<div>
				<Link style={{ marginRight: "20px" }} to="/">Search</Link>
				<Link to="accounts/edit">Account Management</Link>
			</div>
			<div>
				<div>{user?.name}</div>
				<img alt="logo" src={user?.photoURL} />
			</div>
		</div>
	);
}
