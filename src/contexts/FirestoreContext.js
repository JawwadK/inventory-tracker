import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../utilities/firebase";
import { query, doc, where, collection, getDoc, updateDoc, getDocs, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";

const FirestoreContext = createContext();

export function useFirestore() {
	return useContext(FirestoreContext);
}

export function FirestoreProvider({ children }) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	async function fetchUser(email) {
		onSnapshot(doc(db, "users", email), (doc) => {
			if (doc.exists()) {
				setUser({ ...doc.data(), id: doc.id });
			}
		});

	}

	function logout() {
		setUser(null);
		localStorage.removeItem("user");
		toast.success("Logged out successfully");
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
			toast.success("Registered successfully");
			await fetchUser(email);
			localStorage.setItem("user", uid);
		} else {
			// User already exists
			toast.error("User already exists. Please log in.");
		}
	}

	async function login(email, password, rememberMe) {
		const docRef = doc(db, "users", email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			if (docSnap.data().password === password) {
				setUser({ ...docSnap.data(), id: docSnap.id });
				localStorage.setItem("user", docSnap.data().uid);
				if (rememberMe) {
					localStorage.setItem("email", email);
				} else {
					localStorage.removeItem("email");
				}
				toast.success("Logged in successfully.");
			} else {
				// Password is incorrect
				toast.error("Email or Password is incorrect.");
			}
		} else {
			// User does not exists (still show password incorrect message)
			toast.error("Email or Password is incorrect.");
		}
	}

	async function deleteUser() {
		const docRef = doc(db, "users", user.email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			await deleteDoc(docRef);
			logout();
			toast.success("Account deleted successfully.");
		} else {
			// User does not exist
			toast.error("User does not exist or is already deleted.");
		}
	}

	async function updateUserInfo(name, email, photoURL) {
		const docRef = doc(db, "users", user.email);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			await updateDoc(docRef, {
				name: name,
				email: email,
				photoURL: photoURL,
			});
			toast.success("Account information updated successfully");
		} else {
			// User does not exist
			toast.error("User does not exist. Cant update user information.");
		}
	}

	async function updatePassword(oldpassword, password) {
		const docRef = doc(db, "users", user.email);
		const docSnap = await getDoc(docRef);

		if (oldpassword === user.password) {
			if (docSnap.exists()) {
				await updateDoc(docRef, {
					password: password,
				});
				logout();
				toast.success("Password updated successfully");
			} else {
				// User does not exist
				toast.error("User does not exist. Cant update password information.");
			}
		} else {
			// Password is incorrect
			toast.error("Current password is incorrect. Please try again.");
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
		updateUserInfo,
		updatePassword,
		deleteUser,
		login,
		logout,
	};

	return <FirestoreContext.Provider value={value}>{!loading && children}</FirestoreContext.Provider>;
}
