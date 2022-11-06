import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../utilities/firebase";
import { query, doc, where, collection, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

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
			console.log("User data:", docSnap.data());
			setUser({ ...docSnap.data(), id: docSnap.id });
		} else {
			// doc.data() will be undefined in this case
			console.log("No user found!");
		}
	}

	function logout() {
		setUser(null);
		localStorage.clear();
	}

	function randomString() {
		var length = 32;
		var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var result = "";
		for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}

	async function register(name, email, password) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);
		const uid = randomString();

		if (!docSnap.exists()) {
			await setDoc(docRef, {
				name: name,
				password: password,
				email: email,
				uid: uid,
				photoURL: `https://avatars.dicebear.com/api/initials/${name?.trim()}.svg`,
			});
			alert("registered successfully");
			await fetchUser(email);
			localStorage.setItem("user", uid);
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
				localStorage.setItem("user", docSnap.data().uid);
				alert("logged in successfully");
			} else {
				// Password is incorrect
				alert("Email or Password is incorrect. Please try again.");
			}
		} else {
			// User does not exists (still show password incorrect message)
			alert("Email or Password is incorrect. Please try again.");
		}
	}

	async function deleteUser(email) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const confirmDelete = window.confirm("Are you sure you want to delete your account?. This will delete all your data. This action cannot be undone.");
			if (confirmDelete) {
				await deleteDoc(docRef);
				logout();
			}
		} else {
			// User does not exist
			console.log("User does not exist or is already deleted.");
		}
	}

	useEffect(() => {
		async function getUserFromLocalStorage() {
			const user = localStorage.getItem("user");
			if (user) {
				const userRef = query(collection(db, "users"), where("uid", "==", user));
				const userSnap = await getDocs(userRef);
				userSnap.forEach((doc) => {
					setUser({ ...doc.data(), id: doc.id });
				});
			}
			setLoading(false);
		}
		getUserFromLocalStorage();
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
