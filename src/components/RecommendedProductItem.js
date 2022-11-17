import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../utilities/firebase";

export default function RecommendedProductItem({ productItem }) {
	const [inventory, setInventory] = useState(null);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `inventory`), where("productRef", "==", doc(db, "products", productItem?.id))), (snapshot) => {
			setInventory(snapshot.docs?.sort((a, b) => (a.price > b.price ? 1 : -1)).map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, [productItem]);

	return (
		<div className="group relative">
			<div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
				<img src={productItem?.image} alt={productItem?.name} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
			</div>
			<div className="mt-4 flex justify-between">
				<div className="text-left">
					<h3 className="text-sm text-gray-700">
						<Link to={`/product/${productItem?.id}`}>
							<span aria-hidden="true" className="absolute inset-0" />
							{productItem?.name}
						</Link>
					</h3>
					{}
					<p className="mt-1 text-sm text-gray-500">Quantity: {inventory?.length > 0 ? inventory[0]?.quantity : <span className="font-semibold">Out Of Stock</span>}</p>
				</div>
				<p className="text-sm font-medium text-gray-900">{inventory?.length > 0 ? `$${inventory[0]?.price}` : ""}</p>
			</div>
		</div>
	);
}
