import React, { useState } from "react";
import imageCompression from "browser-image-compression";

export default function AddProduct() {
	const [name, getName] = useState("");
	const [upc, getUpc] = useState("");
	const [description, getDescription] = useState("");

	return (
		<div>
			<form>
				<h1>Add A Product</h1>
				<input id="productImage" type="file" />
				<p>Name</p>
				<input id="name" type="text" />
				<p>UPC Code</p>
				<input id="upcCode" type="text" />
				<p>Description</p>
				<textarea id="description" />
				<br />
				<button>Add Product</button>
			</form>
		</div>
	);
}
