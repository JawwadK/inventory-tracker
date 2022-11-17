import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, TimeScale } from "chart.js";
import { useParams } from "react-router-dom";
import { db } from "../utilities/firebase";
import "chartjs-adapter-moment";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useFirestore } from "../contexts/FirestoreContext";
import AddStoreModal from "../modals/AddStoreModal";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, TimeScale);
export const options = {
	responsive: true,
	scales: {
		x: {
			type: "time",
			time: {
				unit: "day",
			},
		},
	},
};

export default function StorePage() {
	const { storeId } = useParams();
	const [store, setStore] = useState(null);
	const [addStoreModalOpen, setAddStoreModalOpen] = useState(false);
	const { user } = useFirestore();

	useEffect(() => {
		async function getProductInfo() {
			const storeInfo = await getDoc(doc(db, "stores", storeId));
			if (storeInfo.exists()) {
				setStore({ ...storeInfo.data(), id: storeInfo.id });
			}
		}
		getProductInfo();
	}, [storeId, addStoreModalOpen]);

	useEffect(() => {
		document.title = `${store?.name} | Inventory Tracker`;
	}, [store]);

	return store ? (
		<div className="bg-white">
			<AddStoreModal open={addStoreModalOpen} setOpen={setAddStoreModalOpen} store={store} />
			<div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
				<div>
					{user.isAdmin === true && (
						<button
							onClick={() => setAddStoreModalOpen(true)}
							className="group relative flex justify-center rounded-full border border-transparent bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<PencilIcon className="h-5 w-5 text-white group-hover:text-indigo-400" />
						</button>
					)}

					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{store?.name}</h2>
                    <p className="mt-4 text-gray-500">{store?.address}</p>
                    <p className=" text-gray-500">{store?.city}, {store?.province}</p>
                    <p className=" text-gray-500">{store?.postal}</p>

				</div>
				<div className="grid gap-4 sm:gap-6 lg:gap-8">
					<img src={store?.image} alt={store?.name} className="rounded-lg bg-gray-100" />
					
				</div>
			</div>
		</div>
	) : (
		<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
			<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Store Not Available</h1>
		</div>
	);
}
