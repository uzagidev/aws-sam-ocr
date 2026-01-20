/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
import ResultsList from "./components/ResultsList";

// eslint-disable-next-line no-undef
const API_URL = process.env.VITE_REACT_APP_API_URL || "http://localhost:3001";

function App() {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleUploadSuccess = (imageId) => {
		setLoading(true);
		// Poll DynamoDB for results after upload
		pollForResults(imageId);
	};

	const pollForResults = (imageId) => {
		const interval = setInterval(async () => {
			const response = await fetchResults(imageId);
			if (response && response.length > 0) {
				clearInterval(interval);
				setLoading(false);
			}
		}, 3000);
	};

	const fetchResults = async (imageId) => {
		try {
			const url = imageId
				? `${API_URL}/results/${encodeURIComponent(imageId)}`
				: `${API_URL}/results`;
			console.log(url);
			const response = await fetch(url);
			const data = await response.json();
			const items =
				typeof data.body === "string"
					? JSON.parse(data.body)
					: data.body || data;
			setResults(Array.isArray(items) ? items : []);
			return items;
		} catch (error) {
			console.error("Error fetching results:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white w-full">
			<header className="py-8 text-center">
				<h1 className="text-4xl font-bold">AWS OCR</h1>
				<p className="mt-2 text-lg">Upload images to extract text</p>
			</header>
			<main className="container mx-auto px-4 py-8 grid grid-cols-3 gap-4 justify-stretch items-stretch border-2 border-cyan-500/50 rounded-lg shadow-lg p-6 text-gray-800">
				<ImageUpload onUploadSuccess={handleUploadSuccess} apiUrl={API_URL} />
				<div className="col-span-2">
					<ResultsList results={results} />
				</div>
			</main>
		</div>
	);
}

export default App;

