import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="text-center text-white bg-white">
			<div className="text-center text-white p-4 bg-gray-800">
				<p>Created with ❤ by CPS731 Group 10: Seyon, Jacky, Jawwad, Leslie, Hamdan </p>
				<>© 2022 Copyright:</>
				<Link className="text-blue-600 ml-1" to="/">
					Inventory Tracker
				</Link>
			</div>
		</footer>
	);
}
