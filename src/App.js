import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthenticationPage from "./pages/AuthenticationPage";
import SearchPage from "./pages/SearchPage";
import { useFirestore } from "./contexts/FirestoreContext";
import NavBar from "./components/NavBar";
import AccountManagementPage from "./pages/AccountManagementPage";
import AdministrationPage from "./pages/AdministrationPage";
import Footer from "./components/Footer";
import ProductPage from "./pages/ProductPage";
import StorePage from "./pages/StorePage";
import { Toaster } from "react-hot-toast";

function App() {
	const { user } = useFirestore();

	return (
		<BrowserRouter>
			<Toaster
				position="top-center"
				reverseOrder={false}
				toastOptions={{
					duration: 4000,
				}}
			/>
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
								<Footer />
							</>
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				{user?.isAdmin === true && (
					<Route
						path="/administration"
						element={
							user ? (
								<>
									<NavBar />
									<AdministrationPage />
									<Footer />
								</>
							) : (
								<Navigate to="/login" replace />
							)
						}
					/>
				)}
				<Route
					path="/product/:productId"
					element={
						user ? (
							<>
								<NavBar />
								<ProductPage />
								<Footer />
							</>
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				<Route
					path="/store/:storeId"
					element={
						user ? (
							<>
								<NavBar />
								<StorePage />
								<Footer />
							</>
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				<Route
					path="/account"
					element={
						user ? (
							<>
								<NavBar />
								<AccountManagementPage />
								<Footer />
							</>
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
