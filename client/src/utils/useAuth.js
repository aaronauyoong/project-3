import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function useAuth(code) {
	console.log("this is the code --->", code);
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	// const location  = useLocation();
	const history = useHistory();

	useEffect(() => {
		axios
			.post("/login", {
				code,
			})
			.then((res) => {
				// console.log(res.data);
				setAccessToken(res.data.accessToken);
				console.log("CONSOLE LOG FOR access token", res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
				// below removes extra code section from URL that we dont want (includes clientID, scopes for Spotify etc)
				window.history.pushState({}, null, "/");
				window.localStorage.setItem("code", accessToken);
			})
			.catch(() => {
				// Note: change to history.push("/") once react router is set up with redirect to login
				history.push("/");
				// window.location = "/";
			});
	}, [code, history, accessToken]);

	// whenever refresh token changes/expires, run the below useEffect()
	useEffect(() => {
		// prevent auto refresh as script below causes refresh token to be ran before acquiring one, returning as undefined and causing errors.
		if (!refreshToken || !expiresIn) return;
		const interval = setInterval(() => {
			axios
				.post("/refresh", {
					refreshToken,
				})
				.then((res) => {
					// console.log(res.data);
					setAccessToken(res.data.accessToken);
					setExpiresIn(res.data.expiresIn);
					// below removes extra code section from URL that we dont want (includes clientID, scopes for Spotify etc)
					window.history.pushState({}, null, "/");
					window.localStorage.removeItem("code");
					window.localStorage.setItem("code", accessToken)
				})
				.catch((err) => {
					// Note: change to history.push("/") once react router is set up with redirect to login
					// window.location = "/";
					history.push("/");
				});
			// 1 minute before expires, will update refreshToken
		}, (expiresIn - 60) * 1000);

		return () => clearInterval(interval);
	}, [refreshToken, expiresIn, history, accessToken]);

	return accessToken;
}
