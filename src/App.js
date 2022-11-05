import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthenticationPage from "./pages/AuthenticationPage";
import SearchPage from "./pages/SearchPage";
import { useFirestore } from "./contexts/FirestoreContext";
import NavBar from "./components/NavBar";

function App() {
	const { user } = useFirestore();
	console.log(user);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/signup" element={!user ? <AuthenticationPage authComponent={<SignUp />} /> : <Navigate to="/" replace />} />
				<Route path="/login" element={!user ? <AuthenticationPage authComponent={<Login />} /> : <Navigate to="/" replace />} />
				<Route
					path="/"
					element={
						user ? (
							<>
								<NavBar />
								<SearchPage />
							</>
						) : (
							<Navigate to="/signup" replace />
						)
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
