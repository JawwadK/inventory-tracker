import React, { Fragment, useEffect, useState } from "react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Combobox, Transition } from "@headlessui/react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../utilities/firebase";
import RecommendedProducts from "../components/RecommendedProducts";

export default function SearchPage() {
	const [products, setProducts] = useState();
	const [inventory, setInventory] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [queryProduct, setQueryProduct] = useState("");

	const filteredProducts =
		queryProduct === ""
			? products
			: products.filter((product) => {
					return product.name.toLowerCase().includes(queryProduct.toLowerCase());
			  });

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `products`), orderBy("name", "asc")), (snapshot) => {
			setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `inventory`), orderBy("timestamp", "desc"), limit(4)), (snapshot) => {
			setInventory(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		document.title = `Search | Inventory Tracker`;
	}, []);

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	return (
		<div>
			{console.log(inventory)}
			<header className="bg-white shadow py-20">
				<div className="mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:px-8 text-center">
					<h1 className=" text-5xl sm:text-6xl font-bold tracking-tight text-blue-600 mb-5">Search for Products</h1>
					{/* TODO: Make into component */}
					<Combobox value={selectedProduct} onChange={setSelectedProduct}>
						{({ open }) => (
							<>
								<div className="relative mt-1">
									<Combobox.Input
										onChange={(event) => setQueryProduct(event.target.value)}
										required
										displayValue={(product) => product?.name}
										className="cursor-text relative block w-full sm:text-lg lg:text-2xl rounded-md border-gray-400 pr-9 focus:border-indigo-500 focus:ring-indigo-500 "
									></Combobox.Input>
									<div className="absolute inset-y-0 right-3 flex items-center">
										<button>
											<MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-indigo-500" aria-hidden="true" />
										</button>
									</div>
									<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
										<Combobox.Options className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
											{filteredProducts?.map((product) => (
												<Combobox.Option
													key={product.id}
													className={({ active }) => classNames(active ? "text-white bg-indigo-600" : "text-gray-900", "relative cursor-pointer select-none py-2 pl-3 pr-9")}
													value={product}
												>
													{({ selectedProduct, active }) => (
														<>
															<div className="flex items-center">
																<img src={product?.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-md" />
																<span className={classNames(selectedProduct ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{product?.name}</span>
															</div>

															{selectedProduct ? (
																<span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
																	<CheckIcon className="h-5 w-5" aria-hidden="true" />
																</span>
															) : null}
														</>
													)}
												</Combobox.Option>
											))}
										</Combobox.Options>
									</Transition>
								</div>
							</>
						)}
					</Combobox>
				</div>
			</header>
			<RecommendedProducts inventory={inventory} title={"Your Watchlist"} subtitle={"See updates with products in your Watchlist."} />
			<RecommendedProducts inventory={inventory} title={"Most Popular"} subtitle={"See updates with products in your Watchlist."} />
			<RecommendedProducts inventory={inventory} title={"Recently Updated"} subtitle={"See updates with products in your Watchlist."} />
		</div>
	);
}
