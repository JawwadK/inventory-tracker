import { collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import StoreItem from "../components/StoreItem";
import { db } from "../utilities/firebase";
import "chartjs-adapter-moment";
import { PencilIcon } from "@heroicons/react/24/outline";
import AddProductModal from "../modals/AddProductModal";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useFirestore } from "../contexts/FirestoreContext";

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

export default function ProductPage() {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [inventory, setInventory] = useState();
	const [inventoryHistory, setInventoryHistory] = useState();
	const [addProductModalOpen, setAddProductModalOpen] = useState(false);
	const [inWishlist, setInWishList] = useState(false);
	const { user } = useFirestore();

	useEffect(() => {
		async function getProductInfo() {
			const productInfo = await getDoc(doc(db, "products", productId));
			if (productInfo.exists()) {
				setProduct({ ...productInfo.data(), id: productInfo.id });
			}
		}
		getProductInfo();
	}, [productId, addProductModalOpen]);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `inventory`), where("productRef", "==", doc(db, "products", productId))), (snapshot) => {
			setInventory(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, [productId]);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `historical_inventory`), where("productRef", "==", doc(db, "products", productId))), (snapshot) => {
			setInventoryHistory(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, [productId]);

	useEffect(() => {
		document.title = `${product?.name} | Inventory Tracker`;
	}, [product]);

	async function handleAddToWishlist() {
		if (inWishlist) {
			await deleteDoc(doc(db, "users", user.id, "wishlist", productId));
			setInWishList(false);
		} else {
			await setDoc(doc(db, "users", user.id, "wishlist", productId), {
				productRef: doc(db, "products", productId),
			});
			setInWishList(true);
		}
	}

	useEffect(() => {
		async function getWishlistInfo() {
			const productInfo = await getDoc(doc(db, `users/${user.id}/wishlist`, productId));
			if (productInfo.exists()) {
				setInWishList(true);
			}
		}
		getWishlistInfo();
	}, [user.id, productId]);

	return product ? (
		<div className="bg-white">
			<AddProductModal open={addProductModalOpen} setOpen={setAddProductModalOpen} product={product} />
			<div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
				<div>
					{user.isAdmin === true && (
						<button
							onClick={() => setAddProductModalOpen(true)}
							className="group relative flex justify-center rounded-full border border-transparent bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<PencilIcon className="h-5 w-5 text-white group-hover:text-indigo-400" />
						</button>
					)}

					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product?.name}</h2>

					{!product?.discontinued ? (
						inventory?.length > 0 && (
							<div className="mt-8">
								<h3 className="text-2xl font-medium text-gray-900">{`Lowest Price Available: $${inventory.sort((a, b) => (a.price > b.price ? 1 : -1))[0].price}`}</h3>
							</div>
						)
					) : (
						<div className="mt-8">
							<h3 className="text-2xl font-medium text-gray-900">DISCONTINUED</h3>
						</div>
					)}

					<p className="mt-4 text-gray-500" dangerouslySetInnerHTML={{ __html: product?.description.replace(/\n/g, "<br />") }}></p>
				</div>
				<div className="grid gap-4 sm:gap-6 lg:gap-8">
					<img src={product?.image} alt={product?.name} className="rounded-lg bg-gray-100 mx-auto" />
					<button
						onClick={() => handleAddToWishlist()}
						className="group relative flex justify-center rounded-full border border-transparent bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700"
					>
						<span className="absolute inset-y-0 left-0 flex items-center pl-3">
							{inWishlist ? (
								<TrashIcon className="h-5 w-5 text-white group-hover:text-indigo-400 group-disabled:text-indigo-400" />
							) : (
								<PlusIcon className="h-5 w-5 text-white group-hover:text-indigo-400 group-disabled:text-indigo-400" />
							)}
						</span>
						<span className="hover:text-indigo-200">{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
					</button>
				</div>
			</div>
			<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Availability:</h1>
				{inventory?.length > 0 ? (
					<div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
						<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
							{inventory?.map((item) => (
								<StoreItem inventoryItem={item} key={item?.id} />
							))}
						</div>
					</div>
				) : (
					<h1 className=" text-2xl font-bold tracking-tight mb-2 text-center">Product not available at any stores</h1>
				)}
			</div>
			<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Price History:</h1>
				<div>
					<div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8"></div>
					<Line
						options={options}
						data={{
							labels: inventoryHistory?.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).map((item) => item?.timestamp.toDate()),
							datasets: [
								{
									label: "Price",
									data: inventoryHistory?.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).map((item) => item?.price),
									fill: false,
									borderColor: "#3333FF",
									backgroundColor: "#212F3D",
									pointBorderColor: "#B2BABB",
									pointBackgroundColor: "#3e3fca",
									pointHoverBackgroundColor: "#3e3fca",
									pointHoverBorderColor: "white",
									borderCapStyle: "butt",
									borderDash: [],
									borderDashOffset: 0.0,
									borderJoinStyle: "miter",
									pointBorderWidth: 1,
									pointHoverRadius: 5,
									pointHoverBorderWidth: 2,
									pointRadius: 3,
									pointHitRadius: 10,
								},
							],
						}}
					/>
				</div>
			</div>
		</div>
	) : (
		<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
			<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Product Not Available</h1>
		</div>
	);
}
