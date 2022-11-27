import { collection, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../utilities/firebase";

export default function WishlistItem({ productItem }) {
	const [product, setProduct] = useState(null);
	const [inventory, setInventory] = useState(null);

	useEffect(() => {
		async function getStoreAndProductInfo() {
			const productInfo = await getDoc(productItem?.productRef);
			setProduct({ ...productInfo.data(), id: productInfo.id });
		}
		getStoreAndProductInfo();
	}, [productItem]);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `inventory`), where("productRef", "==", productItem?.productRef)), (snapshot) => {
			setInventory(snapshot.docs?.sort((a, b) => (a.price > b.price ? 1 : -1)).map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, [productItem]);

	return (
		<div className="group relative">
			<div className="min-h-80 flex items-center justify-center w-full overflow-hidden rounded-md bg-white group-hover:opacity-75 sm:h-80">
				<img src={product?.image} alt={product?.name} className="object-cover object-center" />
			</div>
			<div className="mt-4 flex justify-between">
				<div className="text-left">
					<h3 className="text-sm text-gray-700">
						<Link to={`/product/${product?.id}`}>
							<span aria-hidden="true" className="absolute inset-0" />
							{product?.name}
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
