import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import StoreItem from "../components/StoreItem";
import { db } from "../utilities/firebase";
import "chartjs-adapter-moment";
import { PencilIcon } from "@heroicons/react/24/outline";
import AddProductModal from "../modals/AddProductModal";

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

	// const features = [
	// 	{ name: "Origin", description: "Designed by Good Goods, Inc." },
	// 	{ name: "Material", description: "Solid walnut base with rare earth magnets and powder coated steel card cover" },
	// 	{ name: "Dimensions", description: '6.25" x 3.55" x 1.15"' },
	// 	{ name: "Finish", description: "Hand sanded and finished with natural oil" },
	// 	{ name: "Includes", description: "Wood card tray and 3 refill packs" },
	// 	{ name: "Considerations", description: "Made from natural materials. Grain and color vary with each item." },
	// ];

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

	return product ? (
		<div className="bg-white">
			<AddProductModal open={addProductModalOpen} setOpen={setAddProductModalOpen} product={product} />
			<div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
				<div>
					<button
						onClick={() => setAddProductModalOpen(true)}
						className="group relative flex justify-center rounded-full border border-transparent bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						<PencilIcon className="h-5 w-5 text-white group-hover:text-indigo-400" />
					</button>

					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product?.name}</h2>

					{inventory?.length > 0 && (
						<div className="mt-8">
							<h3 className="text-2xl font-medium text-gray-900">{`Lowest Price Available: $${inventory[0].price}`}</h3>
						</div>
					)}

					<p className="mt-4 text-gray-500">{product?.description}</p>

					{/* <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
						{features.map((feature) => (
							<div key={feature.name} className="border-t border-gray-200 pt-4">
								<dt className="font-medium text-gray-900">{feature.name}</dt>
								<dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
							</div>
						))}
					</dl> */}
				</div>
				<div className="grid gap-4 sm:gap-6 lg:gap-8">
					<img src={product?.image} alt={product?.name} className="rounded-lg bg-gray-100" />
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
									fill: true,
									pointRadius: 1,
									pointHoverRadius: 5,
									backgroundColor: "#3333FF",
									borderColor: "#3333FF",
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
