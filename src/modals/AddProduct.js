import React, { useState } from "react";
import imageCompression from "browser-image-compression";

export default function AddProduct() {
	const [name, setName] = useState("");
	const [upc, setUpc] = useState("");
	const [description, setDescription] = useState("");

	return (
		<div>
			<form>
				<h1>Add A Product</h1>
				<input id="productImage" type="file" />
				<p>Name</p>
				<input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
				<p>UPC Code</p>
				<input id="upcCode" type="text" value={upc} onChange={(e) => setUpc(e.target.value)} />
				<p>Description</p>
				<textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
				<br />
				<button>Add Product</button>
			</form>
		</div>
	);
}
