import React, { Fragment, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Combobox, Transition } from "@headlessui/react";
import { collection, endBefore, getCountFromServer, limit, limitToLast, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "../utilities/firebase";

import { Link, useNavigate } from "react-router-dom";
import { useFirestore } from "../contexts/FirestoreContext";
import RecentlyUpdatedItem from "../components/RecentlyUpdatedItem";
import WishlistItem from "../components/WishlistItem";
import RecommendedProductItem from "../components/RecommendedProductItem";

export default function SearchPage() {
	const [allProducts, setAllProducts] = useState();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [queryProduct, setQueryProduct] = useState("");

	const [products, setProducts] = useState();
	const [productCount, setProductCount] = useState(null);
	const [productPagination, setProductPagination] = useState(null);
	const [productPage, setProductPage] = useState(1);

	const [inventory, setInventory] = useState(null);
	const [inventoryCount, setInventoryCount] = useState(null);
	const [inventoryPagination, setInventoryPagination] = useState(null);
	const [inventoryPage, setInventoryPage] = useState(1);

	const [wishlist, setWishlist] = useState(null);
	const [wishlistCount, setWishlistCount] = useState(null);
	const [wishlistPagination, setWishlistPagination] = useState(null);
	const [wishlistPage, setWishlistPage] = useState(1);

	const navigate = useNavigate();
	const { user } = useFirestore();

	const filteredProducts =
		queryProduct === ""
			? allProducts
			: allProducts.filter((product) => {
					return product.name.toLowerCase().includes(queryProduct.toLowerCase());
			  });

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `products`), orderBy("name", "asc")), (snapshot) => {
			setAllProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, []);

	// Recommended Products
	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `products`), orderBy("name", "asc"), limit(4)), (snapshot) => {
			setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
			setProductPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
			setProductPage(1);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		async function getProductCount() {
			const productCount_ = await getCountFromServer(collection(db, `products`));
			setProductCount(productCount_?.data().count);
		}
		getProductCount();
	}, [products]);

	function handleProductPagination(direction) {
		if (direction === "next") {
			onSnapshot(query(collection(db, `products`), orderBy("name", "asc"), startAfter(productPagination?.last), limit(4)), (snapshot) => {
				setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setProductPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
				setProductPage(productPage + 1);
			});
		} else {
			onSnapshot(query(collection(db, `products`), orderBy("name", "asc"), endBefore(productPagination?.first), limitToLast(4)), (snapshot) => {
				setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setProductPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
				setProductPage(productPage - 1);
			});
		}
	}

	// Recently Updated
	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `inventory`), orderBy("timestamp", "desc"), limit(4)), (snapshot) => {
			setInventory(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
			setInventoryPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
			setInventoryPage(1);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		async function getInventoryCount() {
			const inventoryCount_ = await getCountFromServer(collection(db, `inventory`));
			setInventoryCount(inventoryCount_?.data().count);
		}
		getInventoryCount();
	}, [inventory]);

	function handleInventoryPagination(direction) {
		if (direction === "next") {
			onSnapshot(query(collection(db, `inventory`), orderBy("timestamp", "desc"), startAfter(inventoryPagination?.last), limit(4)), (snapshot) => {
				setInventory(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setInventoryPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
				setInventoryPage(inventoryPage + 1);
			});
		} else {
			onSnapshot(query(collection(db, `inventory`), orderBy("timestamp", "desc"), endBefore(inventoryPagination?.first), limitToLast(4)), (snapshot) => {
				setInventory(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setInventoryPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
				setInventoryPage(inventoryPage - 1);
			});
		}
	}

	// Wishlist
	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, "users", user.id, "wishlist"), limit(4)), (snapshot) => {
			setWishlist(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
			setWishlistPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
			setWishlistPage(1);
		});
		return () => {
			unsubscribe();
		};
	}, [user.id]);

	useEffect(() => {
		async function getWishlistCount() {
			const wishlistCount_ = await getCountFromServer(collection(db, "users", user.id, "wishlist"));
			setWishlistCount(wishlistCount_?.data().count);
		}
		getWishlistCount();
	}, [inventory, user.id]);

	function handleWishlistPagination(direction) {
		if (direction === "next") {
			onSnapshot(query(collection(db, "users", user.id, "wishlist"), startAfter(wishlistPagination?.last), limit(4)), (snapshot) => {
				setWishlist(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setWishlistPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
				setWishlistPage(wishlistPage + 1);
			});
		} else {
			onSnapshot(query(collection(db, "users", user.id, "wishlist"), orderBy("productRef", "asc"), endBefore(wishlistPagination?.first), limitToLast(4)), (snapshot) => {
				setWishlist(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setWishlistPagination({ first: snapshot.docs[0], last: snapshot.docs[snapshot.docs.length - 1] });
				setWishlistPage(wishlistPage - 1);
			});
		}
	}

	useEffect(() => {
		if (selectedProduct) {
			navigate(`/product/${selectedProduct.id}`);
		}
	}, [selectedProduct, navigate]);

	useEffect(() => {
		document.title = `Search | Inventory Tracker`;
	}, []);

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	return (
		<div>
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
												<Link to={`/product/${product.id}`} key={product?.id}>
													<Combobox.Option
														key={product.id}
														className={({ active }) =>
															classNames(active ? "text-white bg-indigo-600" : "text-gray-900", "relative cursor-pointer select-none py-2 pl-3 pr-9")
														}
														value={product}
													>
														{({ selectedProduct }) => (
															<div className="flex items-center">
																<img src={product?.image} alt={product?.name} className="h-6 w-6 flex-shrink-0 rounded-md object-cover" />
																<span className={classNames(selectedProduct ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{product?.name}</span>
															</div>
														)}
													</Combobox.Option>
												</Link>
											))}
										</Combobox.Options>
									</Transition>
								</div>
							</>
						)}
					</Combobox>
				</div>
			</header>
			{wishlist?.length > 0 && (
				<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
					<div className="bg-white mx-auto max-w-2xl py-8 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8 rounded-lg shadow">
						<div className="py-8">
							<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Your Wishlist</h1>
							<p>See updates with products in your Wishlist.</p>
						</div>
						<div>
							<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
								{wishlist?.map((item) => (
									<WishlistItem productItem={item} key={item?.id} />
								))}
							</div>
							<div className="flex items-center justify-between border-t border-gray-200 bg-white py-3 mt-3">
								<div className="flex flex-1 justify-between sm:hidden">
									<button
										className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
										onClick={() => handleWishlistPagination("previous")}
										disabled={wishlistPage === 1}
									>
										<span className="sr-only">Previous</span>
										<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
									</button>

									<button
										className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
										onClick={() => handleWishlistPagination("next")}
										disabled={wishlistPage * 4 >= wishlistCount}
									>
										<span className="sr-only">Next</span>
										<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
									</button>
								</div>
								<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
									<div>
										<p className="text-sm text-gray-700">
											Showing <span className="font-medium">{wishlistPage * 4 - 3}</span> to <span className="font-medium">{Math.min(wishlistPage * 4, wishlistCount)}</span> of{" "}
											<span className="font-medium">{wishlistCount}</span> results
										</p>
									</div>
									<div>
										<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
											<button
												className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
												onClick={() => handleWishlistPagination("previous")}
												disabled={wishlistPage === 1}
											>
												<span className="sr-only">Previous</span>
												<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
											</button>

											<button
												className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
												onClick={() => handleWishlistPagination("next")}
												disabled={wishlistPage * 4 >= wishlistCount}
											>
												<span className="sr-only">Next</span>
												<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
											</button>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
				<div>
					<div className="bg-white mx-auto max-w-2xl py-8 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8 rounded-lg shadow">
						<div className="py-8">
							<h1 className=" text-2xl sm:text-3xl font-bold tracking-tight mb-2">Most Popular</h1>
							<p>See the most popular items.</p>
						</div>
						<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
							{products?.map((item) => (
								<RecommendedProductItem productItem={item} key={item?.id} />
							))}
						</div>
						<div className="flex items-center justify-between border-t border-gray-200 bg-white py-3 mt-3">
							<div className="flex flex-1 justify-between sm:hidden">
								<button
									className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
									onClick={() => handleProductPagination("previous")}
									disabled={productPage === 1}
								>
									<span className="sr-only">Previous</span>
									<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
								</button>

								<button
									className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
									onClick={() => handleProductPagination("next")}
									disabled={productPage * 4 >= productCount}
								>
									<span className="sr-only">Next</span>
									<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
								</button>
							</div>
							<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
								<div>
									<p className="text-sm text-gray-700">
										Showing <span className="font-medium">{productPage * 4 - 3}</span> to <span className="font-medium">{Math.min(productPage * 4, productCount)}</span> of{" "}
										<span className="font-medium">{productCount}</span> results
									</p>
								</div>
								<div>
									<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
										<button
											className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
											onClick={() => handleProductPagination("previous")}
											disabled={productPage === 1}
										>
											<span className="sr-only">Previous</span>
											<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
										</button>

										<button
											className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
											onClick={() => handleProductPagination("next")}
											disabled={productPage * 4 >= productCount}
										>
											<span className="sr-only">Next</span>
											<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
										</button>
									</nav>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
				<div>
					<div className="bg-white mx-auto max-w-2xl py-8 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8 rounded-lg shadow">
						<div className="py-8">
							<h1 className=" text-2xl sm:text-3xl font-bold tracking-tigh mb-2">Recently Updated</h1>
							<p>See the most recently updated items.</p>
						</div>
						<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
							{inventory?.map((item) => (
								<RecentlyUpdatedItem inventoryItem={item} key={item?.id} />
							))}
						</div>
						<div className="flex items-center justify-between border-t border-gray-200 bg-white py-3 mt-3">
							<div className="flex flex-1 justify-between sm:hidden">
								<button
									className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
									onClick={() => handleInventoryPagination("previous")}
									disabled={inventoryPage === 1}
								>
									<span className="sr-only">Previous</span>
									<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
								</button>

								<button
									className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
									onClick={() => handleInventoryPagination("next")}
									disabled={inventoryPage * 4 >= inventoryCount}
								>
									<span className="sr-only">Next</span>
									<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
								</button>
							</div>
							<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
								<div>
									<p className="text-sm text-gray-700">
										Showing <span className="font-medium">{inventoryPage * 4 - 3}</span> to <span className="font-medium">{Math.min(inventoryPage * 4, inventoryCount)}</span> of{" "}
										<span className="font-medium">{inventoryCount}</span> results
									</p>
								</div>
								<div>
									<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
										<button
											className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
											onClick={() => handleInventoryPagination("previous")}
											disabled={inventoryPage === 1}
										>
											<span className="sr-only">Previous</span>
											<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
										</button>

										<button
											className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed"
											onClick={() => handleInventoryPagination("next")}
											disabled={inventoryPage * 4 >= inventoryCount}
										>
											<span className="sr-only">Next</span>
											<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
										</button>
									</nav>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
