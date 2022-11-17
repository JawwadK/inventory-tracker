import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecentlyUpdatedItem({ inventoryItem }) {
	const [product, setProduct] = useState(null);

	useEffect(() => {
		async function getStoreAndProductInfo() {
			const productInfo = await getDoc(inventoryItem?.productRef);
			setProduct({ ...productInfo.data(), id: productInfo.id });
		}
		getStoreAndProductInfo();
	}, [inventoryItem?.productRef, inventoryItem?.storeRef]);

	return (
		<div className="group relative">
			<div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
				<img src={product?.image} alt={product?.name} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
			</div>
			<div className="mt-4 flex justify-between">
				<div className="text-left">
					<h3 className="text-sm text-gray-700">
						<Link to={`/product/${product?.id}`}>
							<span aria-hidden="true" className="absolute inset-0" />
							{product?.name}
						</Link>
					</h3>
					<p className="mt-1 text-sm text-gray-500">Quantity: {inventoryItem?.quantity}</p>
				</div>
				<p className="text-sm font-medium text-gray-900">{`$${inventoryItem?.price}`}</p>
			</div>
		</div>
	);
}
