import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utilities/firebase";

export default function ProductPage() {
	const { productid } = useParams();
	const [product, setProduct] = useState();

	useEffect(() => {
		async function getProductInfo() {
			const productInfo = await getDoc(doc(db, "products", productid));
			setProduct({ ...productInfo.data(), id: productInfo.id });
		}
		getProductInfo();
	}, [productid]);

	useEffect(() => {
		document.title = `${product?.name} | Inventory Tracker`;
	}, [product]);

	return <div>Product Page</div>;
}
