import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AddProductModal from "../modals/AddProductModal";
import AddStoreModal from "../modals/AddStoreModal";
import UpdateInventoryModal from "../modals/UpdateInventoryModal";
import { db } from "../utilities/firebase";
import Moment from "react-moment";
import "moment";
import "moment-timezone";

export default function AdministrationPage() {
	const [logs, setLogs] = useState(null);
	const [addStoreModalOpen, setAddStoreModalOpen] = useState(false);
	const [addProductModalOpen, setAddProductModalOpen] = useState(false);
	const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);

	useEffect(() => {
		document.title = `Administration | Inventory Tracker`;
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, `logs`), orderBy("timestamp", "desc")), (snapshot) => {
			setLogs(snapshot.docs.map((doc) => ({ ...doc.data(), logId: doc.id })));
		});
		return () => {
			unsubscribe();
		};
	}, []);

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
				<h3 className=" mt-12 text-lg leading-6 font-medium text-gray-900">Recent activity</h3>
				<div className=" overflow-x-auto">
					<table className="w-full ">
						<thead>
							<tr>
								<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">User</th>
								<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Action</th>
								<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">id</th>
								<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Date</th>
							</tr>
						</thead>
						<tbody>
							{logs?.length > 0 &&
								logs.map((log) => (
									<tr key={log.logId}>
										<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
											<div className="text-sm leading-5 font-medium text-gray-900">{log.user}</div>
										</td>
										<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
											<div className="text-sm leading-5 text-gray-900">{log.action}</div>
										</td>
										<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
											<div className="text-sm leading-5 text-gray-900">{log.id}</div>
										</td>
										<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
											<div className="text-sm leading-5 text-gray-900">
												<Moment format="LL LTS">{log.timestamp?.toDate()}</Moment>
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
