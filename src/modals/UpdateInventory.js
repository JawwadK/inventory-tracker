import React from "react";

export default function UpdateInventory() {
	return (
		<div>
			<form>
				<h1>Update Inventory</h1>
				<h4>Store:</h4>
				<p>Name</p>
				<p>Address Line 1</p>
				<p>Address Line 2</p>
				<p>City</p>
				<p>Province</p>
				<p>Postal</p>
				<p>Price</p>

				<h4>Product:</h4>
				<p>Name</p>
				<p>UPC Code</p>
				<p>Description</p>


				<input id="price" type="text" />
				<p>Quantity</p>
				<input id="quantity" type="number" />
				<br />
				<button>Add Product</button>
			</form>
		</div>
	);
}
