import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchPage() {
	const [search, setSearch] = useState();
	return (
		<div>
			<header className="bg-white shadow py-20">
				<div className="mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:px-8 text-center">
					<h1 className=" text-5xl sm:text-6xl font-bold tracking-tight text-blue-600 mb-5">Search for Products</h1>
					<div className="relative">
						<input
							type="text"
							name="search"
							id="search"
							className="block w-full sm:text-lg lg:text-2xl rounded-md border-gray-400 pr-9 focus:border-indigo-500 focus:ring-indigo-500 "
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div className="absolute inset-y-0 right-3 flex items-center">
							<button>
								<MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-indigo-500" aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}
