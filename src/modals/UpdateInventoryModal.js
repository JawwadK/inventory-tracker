import { Combobox, Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useRef, useState } from "react";

export default function UpdateInventoryModal({ open, setOpen }) {
	const cancelButtonRef = useRef(null);
	const stores = [
		{
			id: 1,
			name: "Wade Cooper",
			avatar: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 2,
			name: "Arlene Mccoy",
			avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 3,
			name: "Devon Webb",
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
		},
		{
			id: 4,
			name: "Tom Cook",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 5,
			name: "Tanya Fox",
			avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 6,
			name: "Hellen Schmidt",
			avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 7,
			name: "Caroline Schultz",
			avatar: "https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 8,
			name: "Mason Heaney",
			avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 9,
			name: "Claudie Smitham",
			avatar: "https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 10,
			name: "Emil Schaefer",
			avatar: "https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	];

	const products = [
		{
			id: 1,
			name: "Wade Cooper",
			avatar: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 2,
			name: "Arlene Mccoy",
			avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 3,
			name: "Devon Webb",
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
		},
		{
			id: 4,
			name: "Tom Cook",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 5,
			name: "Tanya Fox",
			avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 6,
			name: "Hellen Schmidt",
			avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 7,
			name: "Caroline Schultz",
			avatar: "https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 8,
			name: "Mason Heaney",
			avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 9,
			name: "Claudie Smitham",
			avatar: "https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		{
			id: 10,
			name: "Emil Schaefer",
			avatar: "https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	];
	const [selectedStore, setSelectedStore] = useState(stores[3]);
	const [selectedProduct, setSelectedProduct] = useState(stores[3]);
	const [queryStore, setQueryStore] = useState("");
	const [queryProduct, setQueryProduct] = useState("");

	function handleSave() {
		"";
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
								<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
									<div className="mt-3 text-center sm:mt-0 sm:text-left">
										<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
											Update Inventory
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500">Update the inventory of a product in the database</p>
										</div>
										<form>
											<div className="grid grid-cols-6 gap-6 mt-4">
												<div className="col-span-6">
													<Combobox value={selectedStore} onChange={setSelectedStore}>
														{({ open }) => (
															<>
																<Combobox.Label className="block text-sm font-medium text-gray-700">Store</Combobox.Label>

																<div className="relative mt-1">
																	<Combobox.Input
																		onChange={(event) => setQueryStore(event.target.value)}
																		displayValue={(store) => store.name}
																		className="cursor-text relative w-full rounded-md border border-gray-300 bg-white py-2 pl-11 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
																	></Combobox.Input>
																	<span className="flex items-center absolute inset-y-0 left-0">
																		<img src={filteredStores[0]?.avatar} alt="" className="h-6 w-6 ml-3 flex-shrink-0 rounded-full" />
																	</span>
																	<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
																		<Combobox.Options className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																			{filteredStores.map((store) => (
																				<Combobox.Option
																					key={store.id}
																					className={({ active }) =>
																						classNames(
																							active ? "text-white bg-indigo-600" : "text-gray-900",
																							"relative cursor-default select-none py-2 pl-3 pr-9"
																						)
																					}
																					value={store}
																				>
																					{({ selectedStore, active }) => (
																						<>
																							<div className="flex items-center">
																								<img src={store?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
																								<span className={classNames(selectedStore ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
																									{store?.name}
																								</span>
																							</div>

																							{selectedStore ? (
																								<span
																									className={classNames(
																										active ? "text-white" : "text-indigo-600",
																										"absolute inset-y-0 right-0 flex items-center pr-4"
																									)}
																								>
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

												<div className="col-span-6">
													<Combobox value={selectedProduct} onChange={setSelectedProduct}>
														{({ open }) => (
															<>
																<Combobox.Label className="block text-sm font-medium text-gray-700">Product</Combobox.Label>

																<div className="relative mt-1">
																	<Combobox.Input
																		onChange={(event) => setQueryProduct(event.target.value)}
																		displayValue={(product) => product.name}
																		className="cursor-text relative w-full rounded-md border border-gray-300 bg-white py-2 pl-12 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
																	></Combobox.Input>
																	<span className="flex items-center absolute inset-y-0 left-0">
																		<img src={filteredProducts[0]?.avatar} alt="" className="h-6 w-6 ml-3 flex-shrink-0 rounded-full" />
																	</span>
																	<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
																		<Combobox.Options className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																			{filteredProducts.map((product) => (
																				<Combobox.Option
																					key={product.id}
																					className={({ active }) =>
																						classNames(
																							active ? "text-white bg-indigo-600" : "text-gray-900",
																							"relative cursor-default select-none py-2 pl-3 pr-9"
																						)
																					}
																					value={product}
																				>
																					{({ selectedProduct, active }) => (
																						<>
																							<div className="flex items-center">
																								<img src={product?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
																								<span className={classNames(selectedProduct ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
																									{product?.name}
																								</span>
																							</div>

																							{selectedProduct ? (
																								<span
																									className={classNames(
																										active ? "text-white" : "text-indigo-600",
																										"absolute inset-y-0 right-0 flex items-center pr-4"
																									)}
																								>
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

												<div className="col-span-6 sm:col-span-3">
													<label htmlFor="price" className="block text-sm font-medium text-gray-700">
														Price
													</label>
													<input
														type="text"
														name="price"
														id="price"
														autoComplete="price"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>

												<div className="col-span-6 sm:col-span-3">
													<label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
														Quantity
													</label>
													<input
														type="text"
														name="quantity"
														id="quantity"
														autoComplete="quantity"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
										onClick={() => handleSave()}
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
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
