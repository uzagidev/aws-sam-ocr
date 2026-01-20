function ResultsList({ results }) {
	function handleCopyClick(index) {
		const result = results[index];
		const textToCopy = JSON.stringify(result);
		navigator.clipboard.writeText(textToCopy);
	}

	return (
		<div className="group relative h-full">
			<div className="relative h-full overflow-hidden rounded-2xl bg-slate-950 shadow-2xl p-6">
				<div className="relative">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-white">Result</h3>
							<p className="text-sm text-slate-400">
								{results.length} image extracted
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
									d="M10.704 4.325a1.5 1.5 0 0 1 2.592 0l1.818 3.12a1.5 1.5 0 0 0 .978.712l3.53.764a1.5 1.5 0 0 1 .8 2.465l-2.405 2.693a1.5 1.5 0 0 0-.374 1.15l.363 3.593a1.5 1.5 0 0 1-2.097 1.524l-3.304-1.456a1.5 1.5 0 0 0-1.21 0l-3.304 1.456a1.5 1.5 0 0 1-2.097-1.524l.363-3.593a1.5 1.5 0 0 0-.373-1.15l-2.406-2.693a1.5 1.5 0 0 1 .8-2.465l3.53-.764a1.5 1.5 0 0 0 .979-.711z"
								></path>
							</svg>
						</div>
					</div>
				</div>
				{results.length === 0 && (
					<div className="flex justify-center items-center w-full h-full">
						<svg
							className="h-24 w-24 text-gray-800"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="m15.46 15.88l1.42-1.42L19 16.59l2.12-2.12l1.41 1.41L20.41 18l2.13 2.12l-1.42 1.42L19 19.41l-2.12 2.12l-1.41-1.41L17.59 18l-2.13-2.12M5 19c0 .55.45 1 1 1h7.34c.27.75.66 1.42 1.19 2H6c-1.66 0-3-1.34-3-3c0-.6.18-1.16.5-1.64L9 7.81V6c-.55 0-1-.45-1-1V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v1c0 .55-.45 1-1 1v1.81l2.5 4.37c-.64.17-1.26.45-1.81.82L13 8.35V4h-2v4.35L5.18 18.43c-.11.16-.18.36-.18.57Z"
							></path>
						</svg>
					</div>
				)}
				<div className="my-2 p-1">
					{results.map((result, index) => (
						// <div
						// 	key={result.id}
						// 	className="bg-gray-900 rounded-lg shadow-md p-4 border-2 border-gray-100"
						// >
						// 	<h3 className="text-lg font-semibold text-green-400">
						// 		{result.id}
						// 	</h3>
						// 	<p className="text-sm text-gray-500">{result.DateTime}</p>
						// 	<div className="mt-4">
						// 		<h4 className="font-semibold">Detected Text:</h4>
						// 		<ul className="list-disc list-inside">
						// 			{result.Text?.map((text, idx) => (
						// 				<p key={idx}>{text}</p>
						// 			))}
						// 		</ul>
						// 	</div>
						// </div>
						<div
							className="flex flex-col items-start justify-between bg-slate-900/50 rounded-lg p-2"
							key={result.id}
						>
							<div className="w-full flex items-start justify-between gap-3">
								<div className="flex items-start justify-start gap-3">
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
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
									<div>
										<p className="font-medium text-white">{result.id}</p>
										<p className="text-xs text-slate-400">{result.DateTime}</p>
									</div>
								</div>
								<div>
									<button
										onClick={() => handleCopyClick(index)}
										className="flex items-center justify-center gap-2 rounded cursor-pointer bg-slate-900 px-2 py-2 font-medium text-white transition-colors hover:bg-slate-800"
									>
										<svg
											className="h-6 w-6 text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<g fill="none" strokeWidth="2">
												<path d="M14 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C12.398 4 11.932 4 11 4H8c-1.886 0-2.828 0-3.414.586C4 5.172 4 6.114 4 8v3c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 14 6.068 14 7 14"></path>
												<rect
													width="10"
													height="10"
													x="10"
													y="10"
													rx="2"
												></rect>
											</g>
										</svg>
									</button>
								</div>
							</div>
							<div className="w-full my-2 text-white">
								<div className="flex gap-2">
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
									Detected Text:
								</div>
								<div className="p-2 bg-slate-800/50 rounded-lg mt-2 max-h-96 overflow-y-auto">
									{result.DetectedText.map((text, idx) => (
										<p key={idx} className="my-1">
											{text}
										</p>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default ResultsList;
