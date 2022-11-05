import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../utilities/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const FirestoreContext = createContext();

export function useFirestore() {
	return useContext(FirestoreContext);
}

export function FirestoreProvider({ children }) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	async function fetchUser(email) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			setUser({ ...docSnap.data(), id: docSnap.id });
		} else {
			// doc.data() will be undefined in this case
			console.log("No user found!");
		}
	}

	async function logout() {
		setUser(null);
		localStorage.clear();
	}

	async function register(name, email, password) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			await setDoc(docRef, {
				name: name,
				password: password,
				email: email,
				photoURL: `https://avatars.dicebear.com/api/initials/${name?.trim()}.svg`,
			});
			alert("registered successfully");
			await fetchUser(email);
			localStorage.setItem(
				"user",
				JSON.stringify({
					name: name,
					id: email,
					password: password,
					email: email,
					photoURL: `https://avatars.dicebear.com/api/initials/${name?.trim()}.svg`,
				})
			);
		} else {
			// User already exists
			console.log("User already exists. Please log in.");
		}
	}

	async function login(email, password) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			if (docSnap.data().password === password) {
				setUser({ ...docSnap.data(), id: docSnap.id });
				localStorage.setItem("user", JSON.stringify({ ...docSnap.data(), id: docSnap.id }));
				alert("logged in successfully");
			} else {
				// Password is incorrect
				console.log("Password is incorrect. Please try again.");
			}
		} else {
			// User does not exists (still show password incorrect message)
			console.log("Password is incorrect. Please try again.");
		}
	}

	async function deleteUser(email) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			await deleteDoc(docRef);
		} else {
			// User already exists
			console.log("User does not exist or is already deleted.");
		}
	}

	useEffect(() => {
		const loggedInUser = localStorage.getItem("user");
		console.log(loggedInUser);
		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			setUser(foundUser);
		}
		setLoading(false);
	}, []);

	const value = {
		user,
		setUser,
		register,
		fetchUser,
		deleteUser,
		login,
		logout,
	};

	return <FirestoreContext.Provider value={value}>{!loading && children}</FirestoreContext.Provider>;
}
