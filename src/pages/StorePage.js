import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utilities/firebase";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useFirestore } from "../contexts/FirestoreContext";
import AddStoreModal from "../modals/AddStoreModal";
import axios from "axios";

export default function StorePage() {
	const { storeId } = useParams();
	const [store, setStore] = useState(null);
	const [addStoreModalOpen, setAddStoreModalOpen] = useState(false);

	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [distance, setDistance] = useState(null);

	const { user } = useFirestore();

	useEffect(() => {
		async function getStoreInfo() {
			const storeInfo = await getDoc(doc(db, "stores", storeId));
			if (storeInfo.exists()) {
				setStore({ ...storeInfo.data(), id: storeInfo.id });
			}
		}
		getStoreInfo();
	}, [storeId, addStoreModalOpen]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			setLatitude(position.coords.latitude);
			setLongitude(position.coords.longitude);
		});
	}, []);

	useEffect(() => {
		if (latitude && longitude && store?.place_id) {
			axios
				.get(
					`https://cors-anywhere.seyons-account.workers.dev/https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=place_id:${store?.place_id}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
				)
				.then(({ data }) => {
					setDistance(data?.routes[0]?.legs[0]?.distance?.text);
				});
		}
	}, [latitude, longitude, store?.place_id]);

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
					{distance && <p className="text-sm font-medium text-gray-900">{`${distance} away`}</p>}
					{store?.place_id && (
						<iframe
							className="w-full h-96 mt-4"
							title="Store Map"
							style={{ border: 0 }}
							src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=place_id:${store?.place_id}`}
						></iframe>
					)}
				</div>
				<div className="grid gap-4 sm:gap-6 lg:gap-8">
					<img src={store?.image} alt={store?.name} className="rounded-lg bg-gray-100  mx-auto" />
				</div>
			</div>
		</div>
	) : (
		<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
			<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Store Not Available</h1>
		</div>
	);
}
