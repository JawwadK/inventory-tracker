import React, { useState } from "react";
import Header from "../components/Header";
import AddProductModal from "../modals/AddProductModal";
import AddStoreModal from "../modals/AddStoreModal";
import UpdateInventoryModal from "../modals/UpdateInventoryModal";

export default function AdministrationPage() {
	const [addStoreModalOpen, setAddStoreModalOpen] = useState(false);
	const [addProductModalOpen, setAddProductModalOpen] = useState(false);
	const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);

	return (
		<>
			<Header title="Administration" />
			<AddStoreModal open={addStoreModalOpen} setOpen={setAddStoreModalOpen} />
			<AddProductModal open={addProductModalOpen} setOpen={setAddProductModalOpen} />
			<UpdateInventoryModal open={addInventoryModalOpen} setOpen={setAddInventoryModalOpen} />

			<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<button
					type="button"
					className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					onClick={() => setAddStoreModalOpen(true)}
				>
					Add a store
				</button>

				<button
					type="button"
					className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					onClick={() => setAddProductModalOpen(true)}
				>
					Add a product
				</button>

				<button
					type="button"
					className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					onClick={() => setAddInventoryModalOpen(true)}
				>
					Update inventory
				</button>
			</div>
		</>
	);
}
