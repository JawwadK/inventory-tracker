import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function StoreItem({ inventoryItem }) {
	const [store, setStore] = useState(null);

	useEffect(() => {
		async function getStoreInfo() {
			const storeInfo = await getDoc(inventoryItem?.storeRef);
			setStore({ ...storeInfo.data(), id: storeInfo.id });
		}
		getStoreInfo();
	}, [inventoryItem?.productRef, inventoryItem?.storeRef]);

	return (
		<div className="group relative">
			<div className="min-h-80 flex items-center justify-center w-full overflow-hidden rounded-md bg-white group-hover:opacity-75 sm:h-80">
				<img src={store?.image} alt={store?.name} className="object-cover object-center " />
			</div>
			<div className="mt-4 flex justify-between">
				<div className="text-left">
					<h3 className="text-sm text-gray-700">
						<Link to={`/store/${store?.id}`}>
							<span aria-hidden="true" className="absolute inset-0" />
							<span className="font-bold text-lg">{store?.name}</span>
							<br />
							{store?.address}
						</Link>
					</h3>
					<p className="mt-1 text-sm text-gray-500">Quantity: {inventoryItem?.quantity}</p>
				</div>
				<p className="text-lg font-medium text-gray-900">{`$${inventoryItem?.price}`}</p>
			</div>
		</div>
	);
}
