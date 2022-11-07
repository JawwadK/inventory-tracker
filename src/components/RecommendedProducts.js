import React from "react";
import RecommendedInventoryItem from "./RecommendedInventoryItem";

export default function RecommendedProducts({ inventory, title, subtitle }) {
	return (
		<div className="p-3 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center ">
			<h1 className=" text-2xl sm:text-3xl font-bold tracking-tigh mb-2">{title}</h1>
			<p>{subtitle}</p>
			<div>
				<div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
					<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{inventory?.map((item) => (
							<RecommendedInventoryItem inventoryItem={item} key={item?.id} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
