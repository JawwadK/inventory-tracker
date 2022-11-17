import { Combobox, Dialog, Transition } from "@headlessui/react";
import { addDoc, collection, doc, getDocs, limit, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useFirestore } from "../contexts/FirestoreContext";
import { db } from "../utilities/firebase";

export default function UpdateInventoryModal({ open, setOpen }) {
	const cancelButtonRef = useRef(null);

	const [stores, setStores] = useState();
	const [products, setProducts] = useState();

	const [selectedStore, setSelectedStore] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [queryStore, setQueryStore] = useState("");
	const [queryProduct, setQueryProduct] = useState("");

	const [price, setPrice] = useState();
	const [quantity, setQuantity] = useState();
	const { user } = useFirestore();

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, `products`), (snapshot) => {
			setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, `stores`), (snapshot) => {
			setStores(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, []);

	function resetModal() {
		setSelectedStore(null);
		setSelectedProduct(null);
		setQueryStore("");
		setQueryProduct("");
		setPrice(0.0);
		setQuantity(0);
		setOpen(false);
	}

	async function handleSave(e) {
		e.preventDefault();
		const storeRef = doc(db, "stores", selectedStore.id);
		const productRef = doc(db, "products", selectedProduct.id);
		// Get inventory items in database (should only return 1)
		const inventoryItemQuery = query(
			collection(db, `inventory`),
			where("productRef", "==", doc(db, "products", selectedProduct.id)),
			where("storeRef", "==", doc(db, "stores", selectedStore.id)),
			limit(1)
		);

		// Check if inventory item already exists and get id
		const inventoryItemSnapshots = await getDocs(inventoryItemQuery);
		const inventoryItemId = inventoryItemSnapshots.docs[0]?.id;

		// If inventory item already exists update otherwise add
		if (inventoryItemId) {
			await updateDoc(doc(db, "inventory", inventoryItemId), {
				price: price,
				quantity: quantity,
			}).then(async () => {
				await addDoc(collection(db, "logs"), {
					user: user?.name,
					action: "Update Inventory",
					id: inventoryItemId,
					timestamp: serverTimestamp(),
				});
			});
		} else {
			await addDoc(collection(db, `inventory`), {
				storeRef: storeRef,
				productRef: productRef,
				price: price,
				quantity: quantity,
				timestamp: serverTimestamp(),
			}).then(async (docRef) => {
				await addDoc(collection(db, "logs"), {
					user: user?.name,
					action: "Add Inventory",
					id: docRef?.id,
					timestamp: serverTimestamp(),
				});
			});
		}
		// Add inventory update entry in historical for price tracking
		await addDoc(collection(db, `historical_inventory`), {
			storeRef: storeRef,
			productRef: productRef,
			price: price,
			quantity: quantity,
			timestamp: serverTimestamp(),
		}).then(resetModal());
	}

	const filteredStores =
		queryStore === ""
			? stores
			: stores.filter((store) => {
					return store.name.toLowerCase().includes(queryStore.toLowerCase());
			  });

	const filteredProducts =
		queryProduct === ""
			? products
			: products.filter((product) => {
					return product.name.toLowerCase().includes(queryProduct.toLowerCase());
			  });

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
				<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg z-10">
								<form onSubmit={handleSave}>
									<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
										<div className="mt-3 text-center sm:mt-0 sm:text-left">
											<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
												Update Inventory
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">Update the inventory of a product in the database</p>
											</div>

											<div className="grid grid-cols-6 gap-6 mt-4">
												<div className="col-span-6">
													{/* TODO: Make into component */}
													<Combobox value={selectedStore} onChange={setSelectedStore}>
														{({ open }) => (
															<>
																<Combobox.Label className="block text-sm font-medium text-gray-700">Store</Combobox.Label>

																<div className="relative mt-1">
																	<Combobox.Input
																		onChange={(event) => setQueryStore(event.target.value)}
																		required
																		displayValue={(store) => store?.name}
																		className="cursor-text relative w-full rounded-md border border-gray-300 bg-white py-2 pl-11 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
																	></Combobox.Input>
																	{queryStore && (
																		<span className="flex items-center absolute inset-y-0 left-0">
																			<img src={filteredStores[0]?.image} alt="" className="h-6 w-6 ml-3 flex-shrink-0 rounded-md object-cover" />
																		</span>
																	)}
																	<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
																		<Combobox.Options className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																			{filteredStores.map((store) => (
																				<Combobox.Option
																					key={store.id}
																					className={({ active }) =>
																						classNames(
																							active ? "text-white bg-indigo-600" : "text-gray-900",
																							"relative cursor-pointer select-none py-2 pl-3 pr-9"
																						)
																					}
																					value={store}
																				>
																					{({ selectedStore }) => (
																						<div className="flex items-center">
																							<img src={store?.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-md object-cover" />
																							<span className={classNames(selectedStore ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
																								<span className="font-semibold">{store?.name}</span> - {store?.address}
																							</span>
																						</div>
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

												<div className="col-span-6">
													{/* TODO: Make into component */}
													<Combobox value={selectedProduct} onChange={setSelectedProduct}>
														{({ open }) => (
															<>
																<Combobox.Label className="block text-sm font-medium text-gray-700">Product</Combobox.Label>

																<div className="relative mt-1">
																	<Combobox.Input
																		onChange={(event) => setQueryProduct(event.target.value)}
																		onClick={(event) => setQueryProduct(event.target.value)}
																		required
																		displayValue={(product) => product?.name}
																		className="cursor-text relative w-full rounded-md border border-gray-300 bg-white py-2 pl-12 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
																	></Combobox.Input>
																	{queryProduct && (
																		<span className="flex items-center absolute inset-y-0 left-0">
																			<img src={filteredProducts[0]?.image} alt="" className="h-6 w-6 ml-3 flex-shrink-0 rounded-md object-cover" />
																		</span>
																	)}
																	<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
																		<Combobox.Options className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																			{filteredProducts.map((product) => (
																				<Combobox.Option
																					key={product.id}
																					className={({ active }) =>
																						classNames(
																							active ? "text-white bg-indigo-600" : "text-gray-900",
																							"relative cursor-pointer select-none py-2 pl-3 pr-9"
																						)
																					}
																					value={product}
																				>
																					{({ selectedProduct }) => (
																						<div className="flex items-center">
																							<img src={product?.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-md object-cover" />
																							<span className={classNames(selectedProduct ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
																								{product?.name}
																							</span>
																						</div>
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

												<div className="col-span-6 sm:col-span-3">
													<label htmlFor="price" className="block text-sm font-medium text-gray-700">
														Price
													</label>
													<div className="relative mt-1 rounded-md shadow-sm">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-gray-500 sm:text-sm">$</span>
														</div>
														<input
															type="number"
															name="price"
															step="0.01"
															min="0.00"
															id="price"
															required
															className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
															placeholder="0.00"
															value={price}
															onChange={(e) => setPrice(parseFloat(e.target.value))}
														/>
														<div className="absolute inset-y-0 right-0 flex items-center">
															<label htmlFor="currency" className="sr-only">
																Currency
															</label>
															<div
																id="currency"
																name="currency"
																className="h-full rounded-md border-transparent bg-transparent py-0 px-2 flex items-center text-gray-500 sm:text-sm"
															>
																CAD
															</div>
														</div>
													</div>
												</div>

												<div className="col-span-6 sm:col-span-3">
													<label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
														Quantity
													</label>
													<input
														type="number"
														name="quantity"
														min="0"
														id="quantity"
														required
														autoComplete="quantity"
														placeholder="0"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
														value={quantity}
														onChange={(e) => setQuantity(parseInt(e.target.value))}
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
										<button
											type="submit"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
										>
											Save
										</button>
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => setOpen(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
