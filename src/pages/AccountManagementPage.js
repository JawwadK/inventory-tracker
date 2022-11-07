import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useFirestore } from "../contexts/FirestoreContext";
import DeleteAccountModal from "../modals/DeleteAccountModal";

export default function AccountManagementPage() {
	const { user, updateUserInfo } = useFirestore();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

	useEffect(() => {
		setName(user.name);
		setEmail(user.email);
		setPhotoURL(user.photoURL);
	}, [user, setEmail, setName, setPhotoURL]);

	async function handleProfileUpdate(e) {
		e.preventDefault();
		await updateUserInfo(name, email, photoURL);
	}

	useEffect(() => {
		document.title = `Account Management | Inventory Tracker`;
	}, []);

	return (
		<>
			<Header title="Account Management" />
			<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<DeleteAccountModal open={deactivateModalOpen} setOpen={setDeactivateModalOpen} />
				<div>
					<div className=" md:gap-6">
						<div className="md:col-span-1 py-5">
							<div className="px-4 sm:px-0">
								<h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
								<p className="mt-1 text-sm text-gray-600">This information may be displayed publicly so be careful what you share.</p>
							</div>
						</div>
						<div className="mt-5 md:col-span-2 md:mt-0">
							<form onSubmit={handleProfileUpdate}>
								<div className="shadow sm:overflow-hidden sm:rounded-md">
									<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
										<div>
											<label className="block text-sm font-medium text-gray-700">Photo</label>
											<div className="mt-1 flex items-center">
												<span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
													<img className="h-full w-full text-gray-300" src={photoURL} alt={name} />
												</span>
												<button
													type="button"
													className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												>
													Change
												</button>
											</div>
										</div>

										<div className="grid grid-cols-6 gap-6">
											<div className="col-span-6">
												<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
													Full Name
												</label>
												<input
													type="text"
													name="full-name"
													id="full-name"
													autoComplete="given-name"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={name}
													onChange={(e) => setName(e.target.value)}
												/>
											</div>

											<div className="col-span-6">
												<label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
													Email address
												</label>
												<input
													type="email"
													name="email-address"
													id="email-address"
													autoComplete="email"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Save
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div className="hidden sm:block" aria-hidden="true">
						<div className="py-5">
							<div className="border-t border-gray-200" />
						</div>
					</div>

					<div className="mt-10 sm:mt-0">
						<div className="md:gap-6">
							<div className="md:col-span-1 py-5">
								<div className="px-4 sm:px-0">
									<h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
									<p className="mt-1 text-sm text-gray-600">Decide what actions to take with your account.</p>
								</div>
							</div>

							<div className="mt-5 md:col-span-2 md:mt-0">
								<form action="#" method="POST">
									<div className="overflow-hidden shadow sm:rounded-md">
										<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
											<div className="col-span-6">
												<legend className="sr-only">Delete Account</legend>
												<div className="text-base font-medium text-gray-900 mb-2" aria-hidden="true">
													Delete Account
												</div>
												<button
													type="button"
													className="inline-flex w-auto justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 "
													onClick={() => setDeactivateModalOpen(true)}
												>
													Delete Account
												</button>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
