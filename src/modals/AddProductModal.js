import React, { Fragment, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../utilities/firebase";
import { useFirestore } from "../contexts/FirestoreContext";

export default function AddProductModal({ open, setOpen, product }) {
	const cancelButtonRef = useRef(null);
	const [name, setName] = useState("");
	const [upc, setUpc] = useState("");
	const [description, setDescription] = useState("");
	const [discontinued, setDiscontinued] = useState(false);
	const [file, setFile] = useState("");
	const [fileName, setFileName] = useState("");
	const [progress, setProgress] = useState(0);
	const { user } = useFirestore();

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

	useEffect(() => {
		if (product) {
			setName(product.name);
			setUpc(product.upc);
			setDescription(product.description);
			setDiscontinued(product.discontinued || false);
		}
	}, [product]);

	function resetModal() {
		setName("");
		setUpc("");
		setDescription("");
		setDiscontinued(false);
		setFile("");
		setFileName("");
		setProgress(0);
		setOpen(false);
	}

	async function handleSave(e) {
		e.preventDefault();
		const storageRef = ref(storage, `products/${Math.floor(Math.random() * (9999 - 1000)) + 1000}-${fileName}`);
		const uploadTask = file && uploadBytesResumable(storageRef, file);

		file
			? uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								setProgress(progress);
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
							console.log("File available at", downloadURL);
							product
								? await updateDoc(doc(db, "products", product.id), { name, upc, description, image: downloadURL, timestamp: serverTimestamp() }).then(async () => {
										resetModal();
										await addDoc(collection(db, "logs"), {
											user: user?.name,
											action: "Edit Product",
											id: upc,
											discontinued: discontinued,
											timestamp: serverTimestamp(),
										});
								  })
								: await setDoc(doc(db, "products", upc), { name, upc, description, image: downloadURL, timestamp: serverTimestamp() }).then(async () => {
										resetModal();
										await addDoc(collection(db, "logs"), {
											user: user?.name,
											action: "Add New Product",
											id: upc,
											timestamp: serverTimestamp(),
										});
								  });
						});
					}
			  )
			: // Case for when editing a product without image
			  await updateDoc(doc(db, `products`, upc), {
					name: name,
					upc: upc,
					description: description,
					discontinued: discontinued,
					timestamp: serverTimestamp(),
			  }).then(async () => {
					resetModal();
					await addDoc(collection(db, "logs"), {
						user: user?.name,
						action: "Edit Product",
						id: upc,
						timestamp: serverTimestamp(),
					});
			  });
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
								<form onSubmit={handleSave}>
									<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
										<div className="mt-3 text-center sm:mt-0 sm:text-left">
											<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
												{product ? "Edit" : "Add"} Product
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													{product ? "Edit" : "Add"} a Product {product ? "in" : "to"} the database
												</p>
											</div>
											<div className="my-2">
												{file ? (
													<img src={window.URL.createObjectURL(file)} className="min-w-full h-72 object-cover" alt="Upload" />
												) : (
													product && <img src={product?.image} className="min-w-full h-72 object-cover" alt="Upload" />
												)}
												<label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="file_input">
													Upload file
												</label>
												<input
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
													aria-describedby="file_input_help"
													id="file_input"
													type="file"
													required={product ? false : true}
													accept="image/*"
													onChange={handleFileChange}
												></input>
											</div>
											<div className="my-2">
												<label htmlFor="upc" className="block text-sm font-medium text-gray-700">
													UPC Code
												</label>
												<input
													id="upc"
													type="text"
													className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-400 disabled:hover:cursor-not-allowed"
													value={upc}
													required
													onChange={(e) => setUpc(e.target.value)}
													disabled={product ? true : false}
												/>
											</div>
											<div className="my-2">
												<label htmlFor="name" className="block text-sm font-medium text-gray-700">
													Name
												</label>
												<input
													id="name"
													type="text"
													className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={name}
													required
													onChange={(e) => setName(e.target.value)}
												/>
											</div>
											<div className="my-2">
												<label htmlFor="description" className="block text-sm font-medium text-gray-700">
													Description
												</label>
												<textarea
													id="name"
													type="text"
													className="block w-full h-40 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={description}
													required
													onChange={(e) => setDescription(e.target.value)}
												/>
											</div>
											<div className="my-2 flex items-start">
												<div className="flex h-5 items-center">
													<input
														id="discontinued"
														name="discontinued"
														type="checkbox"
														checked={discontinued}
														onChange={() => setDiscontinued(!discontinued)}
														className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
													/>
												</div>
												<div className="ml-3 text-sm">
													<label htmlFor="discontinued" className="font-medium text-gray-700">
														Discontinued?
													</label>
													<p className="text-gray-500">
														Mark product as obsolete/discontinued. This will make this product inactive and inventory information can not be updated.
													</p>
												</div>
											</div>
										</div>
										<div className="w-full bg-gray-200 h-1">
											<div className="bg-blue-600 h-1 rounded-md" style={{ width: `${progress}%` }}></div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
										<button
											type="submit"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
											disabled={progress > 0}
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
