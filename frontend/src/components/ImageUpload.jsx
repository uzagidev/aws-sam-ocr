/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";

function ImageUpload({ onUploadSuccess, apiUrl }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
			setError(null);
		}
	};

	const getFileSize = (bytes) => {
		if (bytes < 1024 * 1024) {
			return `${(bytes / 1024).toFixed(2)} KB`;
		}
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const truncateString = (str, num) => {
		if (str.length > num) {
			return str.slice(0, num) + "...";
		}
		return str;
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setError("Please select an image");
			return;
		}

		setUploading(true);
		setProgress(0);
		try {
			const reader = new FileReader();
			reader.onloadend = async () => {
				const base64Image = reader.result.split(",")[1];
				const response = await axios.post(
					`${apiUrl}/upload`,
					{ image: base64Image },
					{
						headers: { "Content-Type": "application/json" },
						onUploadProgress: (progressEvent) => {
							const percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							setProgress(percentCompleted);
						},
					}
				);

				setTimeout(() => {
					setSelectedFile(null);
					setPreview(null);
					setProgress(100);
					onUploadSuccess(response.data.image_id);
					setUploading(false);
				}, 3000);
			};
			reader.readAsDataURL(selectedFile);
		} catch (err) {
			setError("Upload failed: " + err.message);
		} finally {
			// setUploading(false);
		}
	};

	return (
		<div className="group relative w-full h-full">
			<div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl h-full">
				<div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-sky-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
				<div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
				<div className="relative p-6  h-full">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-white">Upload Files</h3>
							<p className="text-sm text-slate-400">
								Drag &amp; drop your files here
							</p>
						</div>
						<div className="rounded-lg bg-cyan-500/10 p-2">
							<svg
								className="h-6 w-6 text-cyan-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>
					</div>
					<div className="group/dropzone mt-6">
						<div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 transition-colors group-hover/dropzone:border-cyan-500/50">
							<input
								type="file"
								className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
								multiple
								accept="image/*"
								onChange={handleFileChange}
							/>
							<div className="space-y-6 text-center">
								<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">
									<svg
										className="h-10 w-10 text-cyan-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<div className="space-y-2">
									<p className="text-base font-medium text-white">
										Drop your files here or browse
									</p>
									<p className="text-sm text-slate-400">
										Support files: JPG, PNG, JPEG
									</p>
									<p className="text-xs text-slate-400">Max file size: 10MB</p>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-6 space-y-4">
						{selectedFile && (
							<div className="rounded-xl bg-slate-900/50 p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-emerald-500/10 p-2">
											<svg
												className="h-6 w-6 text-emerald-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<div>
											<p className="font-medium text-white">
												{truncateString(selectedFile.name, 30)}
											</p>
											<p className="text-xs text-slate-400">
												{getFileSize(selectedFile.size)} •{" "}
												{selectedFile.type.split("/")[1].toUpperCase()}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-emerald-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="mt-6 grid grid-cols-2 gap-4">
						<button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-800">
							Clear All
						</button>
						{!uploading ? (
							<button
								className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 p-px font-medium text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset] transition-colors hover:shadow-[0_1000px_0_0_hsl(0_0%_100%_/_2%)_inset]"
								onClick={handleUpload}
							>
								<span className="relative flex items-center justify-center gap-2 rounded-xl bg-slate-950/50 px-4 py-2 transition-colors group-hover/btn:bg-transparent">
									Upload & Go
									<svg
										className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
								</span>
							</button>
						) : (
							<button className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 p-px font-medium text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset]">
								<span className="relative flex items-center justify-center gap-2 rounded-xl bg-slate-950/50 px-4 py-2 transition-colors group-hover/btn:bg-transparent">
									Processing
									<svg
										className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											fill="none"
											stroke="currentColor"
											strokeDasharray="15"
											strokeDashoffset="15"
											strokeLinecap="round"
											strokeWidth="2"
											d="M12 3C16.9706 3 21 7.02944 21 12"
										>
											<animate
												fill="freeze"
												attributeName="stroke-dashoffset"
												dur="0.3s"
												values="15;0"
											></animate>
											<animateTransform
												attributeName="transform"
												dur="0.85s"
												repeatCount="indefinite"
												type="rotate"
												values="0 12 12;360 12 12"
											></animateTransform>
										</path>
									</svg>
								</span>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ImageUpload;
