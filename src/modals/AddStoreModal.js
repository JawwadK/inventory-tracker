import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";

export default function AddStoreModal({ open, setOpen }) {
	const cancelButtonRef = useRef(null);

	function handleSave() {
		"";
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
							<Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
									<div className="mt-3 text-center sm:mt-0 sm:text-left">
										<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
											Add Store
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500">Add a Store to the database</p>
										</div>
										<form>
											<div className="my-2">
												<input id="productImage" type="file" />
											</div>
											<div className="grid grid-cols-6 gap-6">
												<div className="col-span-6">
													<label htmlFor="name" className="block text-sm font-medium text-gray-700">
														Name
													</label>
													<input
														type="text"
														name="name"
														id="name"
														autoComplete="given-name"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>

												<div className="col-span-6">
													<label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
														Email address
													</label>
													<input
														type="text"
														name="email-address"
														id="email-address"
														autoComplete="email"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>

												<div className="col-span-6">
													<label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
														Street address
													</label>
													<input
														type="text"
														name="street-address"
														id="street-address"
														autoComplete="street-address"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>

												<div className="col-span-6 sm:col-span-6 lg:col-span-2">
													<label htmlFor="city" className="block text-sm font-medium text-gray-700">
														City
													</label>
													<input
														type="text"
														name="city"
														id="city"
														autoComplete="address-level2"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>

												<div className="col-span-6 sm:col-span-3 lg:col-span-2">
													<label htmlFor="region" className="block text-sm font-medium text-gray-700">
														Province
													</label>
													<input
														type="text"
														name="region"
														id="region"
														autoComplete="address-level1"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													/>
												</div>

												<div className="col-span-6 sm:col-span-3 lg:col-span-2">
													<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
														Postal code
													</label>
													<input
														type="text"
														name="postal-code"
														id="postal-code"
														autoComplete="postal-code"
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
