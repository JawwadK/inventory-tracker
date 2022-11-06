import React from "react";
import AddProduct from "../modals/AddProduct";
import AddStore from "../modals/AddStore";
import UpdateInventory from "../modals/UpdateInventory";

export default function AdministrationPage() {
	return (
		<div>
			<h1>Administration</h1>

			<h2>Add a Store</h2>
			<AddStore />
			<h2>Add a Product</h2>
			<AddProduct />
			<h2>Update Inventory</h2>
			<UpdateInventory />
		</div>
	);
}
