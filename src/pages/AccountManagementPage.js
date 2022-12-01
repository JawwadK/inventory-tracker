import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Header from "../components/Header";
import { useFirestore } from "../contexts/FirestoreContext";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import { storage } from "../utilities/firebase";
import toast from "react-hot-toast";

export default function AccountManagementPage() {
	const { user, fetchUser, updateUserInfo, updatePassword, logout } = useFirestore();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [file, setFile] = useState("");
	const [fileName, setFileName] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

	useEffect(() => {
		setName(user.name);
		setEmail(user.email);
		setPhotoURL(user.photoURL);
	}, [user, setEmail, setName, setPhotoURL]);

	function validateNewPassword(target) {
		if (newPassword === password) {
			target.setCustomValidity("Password cant be the same as current password");
		} else {
			target.setCustomValidity("");
		}
	}

	function validateConfirmPassword(target) {
		if (newPassword !== confirmPassword) {
			target.setCustomValidity("Passwords don't match");
		} else {
			target.setCustomValidity("");
		}
	}

	async function handlePasswordChange(e) {
		e.preventDefault();
		await updatePassword(password, newPassword);
		setPassword("");
		setNewPassword("");
		setConfirmPassword("");
	}

	const handleFileChange = async (e) => {
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};

		const compressedFile = await imageCompression(e.target.files[0], options);

		setFile(compressedFile);
		var filePath = e.target.value.toString().split("\\");
		var name = filePath[filePath.length - 1];
		if (name.length > 20) name = name.split(".")[0].substring(0, 20) + "...." + name.split(".")[name.split(".").length - 1];
		setFileName(`${name}`);
	};

	async function handleProfileUpdate(e) {
		e.preventDefault();

		const storageRef = ref(storage, `profiles/${Math.floor(Math.random() * (9999 - 1000)) + 1000}-${fileName}`);
		const uploadTask = file && uploadBytesResumable(storageRef, file);

		file
			? uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						toast.loading("Upload is " + progress + "% done", { id: "upload" });
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
							default:
								break;
						}
					},
					(error) => {
						// A full list of error codes is available at
						// https://firebase.google.com/docs/storage/web/handle-errors
						switch (error.code) {
							case "storage/unauthorized":
								// User doesn't have permission to access the object
								break;
							case "storage/canceled":
								// User canceled the upload
								break;
							// ...
							case "storage/unknown":
								// Unknown error occurred, inspect error.serverResponse
								break;
							default:
								break;
						}
					},
					() => {
						// Upload completed successfully, now we can get the download URL
						getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
							toast.success("File uploaded successfully", { id: "upload" });
							console.log("File available at", downloadURL);
							setPhotoURL(downloadURL);
							await updateUserInfo(name, email, downloadURL);
						});
					}
			  )
			: await updateUserInfo(name, email, photoURL);

		setFile("");
		setFileName("");
		fetchUser(email);
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
													{file ? (
														<img className="h-full w-full text-gray-300" src={window.URL.createObjectURL(file)} alt={name} />
													) : (
														<img className="h-full w-full text-gray-300" src={photoURL} alt={name} />
													)}
												</span>
												<button
													type="button"
													className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													onClick={() => {
														document.getElementById("file_input").click();
													}}
												>
													Change
												</button>
												<input
													className="mt-1 w-full hidden"
													aria-describedby="file_input_help"
													id="file_input"
													type="file"
													accept="image/*"
													onChange={handleFileChange}
												></input>
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
													autoComplete="name"
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

					<div className=" md:gap-6">
						<div className="md:col-span-1 py-5">
							<div className="px-4 sm:px-0">
								<h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
								<p className="mt-1 text-sm text-gray-600">Change the password you use to sign-in.</p>
							</div>
						</div>
						<div className="mt-5 md:col-span-2 md:mt-0">
							<form onSubmit={handlePasswordChange}>
								<div className="shadow sm:overflow-hidden sm:rounded-md">
									<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
										<div className="grid grid-cols-6 gap-6">
											<div className="col-span-6">
												<label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
													Current password
												</label>
												<input
													type="password"
													name="current-password"
													id="current-password"
													autoComplete="current-password"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
											</div>
											<div className="col-span-6">
												<label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
													New password
												</label>
												<input
													type="password"
													name="new-password"
													id="new-password"
													autoComplete="new-password"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={newPassword}
													onKeyUp={(e) => validateNewPassword(e.target)}
													onChange={(e) => setNewPassword(e.target.value)}
												/>
											</div>
											<div className="col-span-6">
												<label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
													Confirm password
												</label>
												<input
													type="password"
													name="confirm-password"
													id="confirm-password"
													autoComplete="new-password"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={confirmPassword}
													onKeyUp={(e) => validateConfirmPassword(e.target)}
													onChange={(e) => setConfirmPassword(e.target.value)}
												/>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Change
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
												<legend className="sr-only">Account Actions</legend>
												<div className="text-base font-medium text-gray-900 mb-2" aria-hidden="true">
													Account Actions
												</div>
												<button
													type="button"
													className="inline-flex w-auto justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 "
													onClick={() => setDeactivateModalOpen(true)}
												>
													Delete Account
												</button>

												<button
													type="button"
													className=" inline-flex ml-5 w-auto justify-center rounded-md border border-gray-300 bg-white text-gray-700 px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													onClick={logout}
												>
													Logout
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
