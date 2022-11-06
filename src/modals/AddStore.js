import React from "react";

export default function AddStore() {
	return (
		<div>
			<form>
				<h1>Add A Store</h1>
				<input id="storeImage" type="file" />
				<p>Name</p>
				<input id="name" type="text" />
				<p>Address Line 1</p>
				<input id="address1" type="text" />
				<p>Address Line 2</p>
				<input id="address2" type="text" />
				<p>City</p>
				<input id="city" type="text" />
				<p>Province</p>
				<input id="province" type="text" />
				<p>Postal Code</p>
				<input id="postal" type="text" />
				<p>Description</p>
				<textarea id="description" />
				<br />
				<button>Add Product</button>
			</form>
		</div>
	);
}
