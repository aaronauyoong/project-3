import { React, useState, useEffect } from "react";
import useAuth from "../../utils/useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
	clientId: "2ae77a009ef04f15b6de9046ff925ebb",
});
const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists = ({ code }) => {
    const accessToken = useAuth(code);
    console.log(code);
	const [token, setToken] = useState("");
	const [data, setData] = useState({});
	console.log(data);

    useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	// useEffect(() => {
	// 	if (localStorage.getItem("accessToken")) {
	// 		setToken(localStorage.getItem("accessToken"));
	// 	}
	// }, []);


    // need to fix how we get playlists
	const handleGetPlaylists = () => {
		axios
			.get(PLAYLIST_ENDPOINT, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			<button onClick={handleGetPlaylists}>Get Playlists</button>
		</div>
	);
};

export default SpotifyGetPlaylists;
