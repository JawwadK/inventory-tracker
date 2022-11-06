import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useFirestore } from "../contexts/FirestoreContext";
import { FaUserEdit, FaCog, FaSignOutAlt, FaQuestionCircle } from "react-icons/fa";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const navigation = [
	{ name: "Search", href: "#", current: true },
	{ name: "Adminstration", href: "#", current: false },
	{ name: "Projects", href: "#", current: false },
	{ name: "Calendar", href: "#", current: false },
];

export default function NavBar() {
	const { user, logout } = useFirestore();
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
									<img className="block h-8 w-auto lg:hidden" src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500" alt="Inventory Tracker" />
									<img className="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500" alt="Inventory Tracker" />
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								{/* <button
									type="button"
									className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
								>
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button> */}
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
									</div>
								</div>

								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="sr-only">Open user menu</span>
											<img className="h-8 w-8 rounded-full" src={user?.photoURL} alt="" />
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
										<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md divide-y bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div className="py-1 text-center">
												<p className="font-bold m-0">{user?.name}</p>
												<p className="grey text-gray-600 m-0">{user?.email}</p>
											</div>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<Link to="/accounts" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 no-underline")}>
															Your Profile
														</Link>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<Link to="/accounts/edit" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 no-underline")}>
															Settings
														</Link>
													)}
												</Menu.Item>
											</div>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<Link onClick={logout} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 no-underline")}>
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
								href="/"
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
								href="/administration"
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

		// 	<nav className="bg-gray-800 relative flex h-16 items-center justify-between">
		// 		<div>
		// 			<h1>Inventory Tracker</h1>
		// 		</div>
		// 		<div className="nav-bar">
		// 			<Link to="/">Search</Link>
		// 			<Link to="/accounts/edit">Account Management</Link>
		// 			<Link to="/administration">Administration</Link>
		// 			<div>{user?.name}</div>
		// 			<img className="profile" alt="logo" src={user?.photoURL} />
		// 		</div>
		// 	</nav>
	);
}
