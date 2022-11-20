import { Combobox, Dialog, Transition } from "@headlessui/react";
import imageCompression from "browser-image-compression";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useFirestore } from "../contexts/FirestoreContext";
import { db, storage } from "../utilities/firebase";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import axios from "axios";

export default function AddStoreModal({ open, setOpen, store }) {
	const cancelButtonRef = useRef(null);
	const [name, setName] = useState("");
	const [file, setFile] = useState("");
	const [fileName, setFileName] = useState("");
	const [progress, setProgress] = useState(0);
	const [place, setPlace] = useState(null);
	const [placeId, setPlaceId] = useState("");
	const [address, setAddress] = useState("");

	const { user } = useFirestore();

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	useEffect(() => {
		if (place) {
			setPlaceId(place.place_id);
			axios
				.get(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.place_id}&fields=name,formatted_address&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
				.then(({ data }) => {
					console.log(data);
					setAddress(data.results[0].formatted_address);
				});
		}
	}, [place]);

	const { placePredictions, getPlacePredictions } = useGoogle({
		apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		options: {
			types: ["establishment"],
			fields: ["formatted_address", "address_components"],
		},
	});

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
		if (store) {
			setName(store.name);
			setPlace(store.place);
		}
	}, [store]);

	function resetModal() {
		setName("");
		setPlace("");
		setFile("");
		setFileName("");
		setProgress(0);
		setOpen(false);
	}

	async function handleSave(e) {
		e.preventDefault();
		const storageRef = ref(storage, `stores/${Math.floor(Math.random() * (9999 - 1000)) + 1000}-${fileName}`);
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
							store
								? await updateDoc(doc(db, `stores`, store.id), {
										name: name,
										place: place,
										place_id: placeId,
										address: address,
										timestamp: serverTimestamp(),
										image: downloadURL,
								  }).then(async () => {
										resetModal();
										await addDoc(collection(db, "logs"), {
											user: user?.name,
											action: "Edit Store",
											id: store.id,
											timestamp: serverTimestamp(),
										});
								  })
								: await addDoc(collection(db, `stores`), {
										name: name,
										place: place,
										place_id: placeId,
										address: address,
										timestamp: serverTimestamp(),
										image: downloadURL,
								  }).then(async (docRef) => {
										resetModal();
										await addDoc(collection(db, "logs"), {
											user: user?.name,
											action: "Add New Store",
											id: docRef?.id,
											timestamp: serverTimestamp(),
										});
								  });
						});
					}
			  ) // Case for when editing a product without image
			: await updateDoc(doc(db, `stores`, store.id), {
					name: name,
					place: place,
					place_id: placeId,
					address: address,
					timestamp: serverTimestamp(),
			  }).then(async () => {
					resetModal();
					await addDoc(collection(db, "logs"), {
						user: user?.name,
						action: "Edit Store",
						id: store.id,
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
												{store ? "Edit" : "Add"} Store
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													{store ? "Edit" : "Add"} a Store {store ? "in" : "to"} the database
												</p>
											</div>

											<div className="my-2">
												{file ? (
													<img src={window.URL.createObjectURL(file)} className="min-w-full h-72 object-cover" alt="Upload" />
												) : (
													store && <img src={store?.image} className="min-w-full h-72 object-cover" alt="Upload" />
												)}

												<label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="file_input">
													Upload file
												</label>
												<input
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
													aria-describedby="file_input_help"
													id="file_input"
													type="file"
													required={store ? false : true}
													accept="image/*"
													onChange={handleFileChange}
												></input>
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
														required
														autoComplete="given-name"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
														value={name}
														onChange={(e) => setName(e.target.value)}
													/>
												</div>
												<div className="col-span-6">
													<div className="relative">
														<Combobox value={place} onChange={setPlace}>
															{({ open }) => (
																<>
																	<Combobox.Label className="block text-sm font-medium text-gray-700">Search for store</Combobox.Label>

																	<div className="relative mt-1">
																		<Combobox.Input
																			onChange={(e) => {
																				getPlacePredictions({ input: e.target.value });
																			}}
																			type="text"
																			name="address"
																			id="address"
																			placeholder="Search for store"
																			autoComplete="address"
																			displayValue={(prediction) => prediction?.description}
																			className="cursor-text relative w-full rounded-md border border-gray-300 bg-white py-2 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
																		></Combobox.Input>
																		<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
																			<Combobox.Options className="absolute z-20 mt-1 max-h-20 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																				{placePredictions.map((prediction, id) => (
																					<Combobox.Option
																						key={id}
																						className={({ active }) =>
																							classNames(
																								active ? "text-white bg-indigo-600" : "text-gray-900",
																								"relative cursor-pointer select-none py-2 pl-3 pr-9"
																							)
																						}
																						value={prediction}
																					>
																						{({ selectedPrediction }) => (
																							<div className="flex items-center">
																								<span className={classNames(selectedPrediction ? "font-semibold" : "font-normal", "block truncate")}>
																									<span className="font-semibold">{prediction?.description}</span>
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
												</div>
											</div>
										</div>
										{place && (
											<iframe
												className="w-full h-80 mt-4"
												title="Store Map"
												style={{ border: 0 }}
												src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=place_id:${place?.place_id}`}
											></iframe>
										)}
										<div className="w-full bg-gray-200 h-1 mt-2">
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
