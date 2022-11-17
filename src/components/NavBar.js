import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

import { useFirestore } from "../contexts/FirestoreContext";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
	const { user, logout } = useFirestore();
	// eslint-disable-next-line no-unused-vars
	const { selected, setSelected } = useState(false);

	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }) => (
				<>
					<div className="mx-auto px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Link className="block w-auto lg:hidden text-2xl text-white" to="/" alt="Inventory Tracker">
										Inventory Tracker
									</Link>
									<Link className="hidden w-auto lg:block text-2xl text-white" to="/" alt="Inventory Tracker">
										Inventory Tracker
									</Link>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-2">
										<Link
											to="/"
											className={classNames(
												selected ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
												"px-3 py-2 rounded-md text-sm font-medium no-underline"
											)}
											aria-current={selected ? "page" : undefined}
										>
											Search
										</Link>
										{user.isAdmin === true && (
											<Link
												to="/administration"
												className={classNames(
													selected ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
													"px-3 py-2 rounded-md text-sm font-medium no-underline"
												)}
												aria-current={selected ? "page" : undefined}
											>
												Administration
											</Link>
										)}
									</div>
								</div>

								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="sr-only">Open user menu</span>
											<img className="h-8 w-8 rounded-full object-cover" src={user?.photoURL} alt="" />
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute w-auto right-0 z-10 mt-2 origin-top-right rounded-md divide-y bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div className="py-1 text-center">
												<p className="font-bold m-0 ">{user?.name}</p>
												<p className="grey text-gray-600 m-0 px-2">{user?.email}</p>
											</div>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<Link to="/help" className={classNames(active ? "bg-gray-100" : "", "flex px-4 py-2 text-sm gap-1 text-gray-700 no-underline")}>
															<QuestionMarkCircleIcon className="block h-5 w-5" />
															Help
														</Link>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<Link to="/account" className={classNames(active ? "bg-gray-100" : "", "flex px-4 py-2 text-sm gap-1 text-gray-700 no-underline")}>
															<Cog6ToothIcon className="block h-5 w-5" />
															Settings
														</Link>
													)}
												</Menu.Item>
											</div>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<Link onClick={logout} className={classNames(active ? "bg-gray-100" : "", "flex px-4 py-2 text-sm gap-1 text-gray-700 no-underline")}>
															<ArrowLeftOnRectangleIcon className="block h-5 w-5" />
															Sign out
														</Link>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3">
							<Disclosure.Button
								as={Link}
								to="/"
								className={classNames(
									selected ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
									"block px-3 py-2 rounded-md text-base font-medium no-underline"
								)}
								aria-current={selected ? "page" : undefined}
							>
								Search
							</Disclosure.Button>
							<Disclosure.Button
								as={Link}
								to="/administration"
								className={classNames(
									selected ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
									"block px-3 py-2 rounded-md text-base font-medium no-underline"
								)}
								aria-current={selected ? "page" : undefined}
							>
								Administration
							</Disclosure.Button>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
