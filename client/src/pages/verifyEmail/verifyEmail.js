import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Login from '../login/login';

const VerifyEmail = () => {
  const [validUrl, setValidUrl] = useState(true);
	const param = useParams();
	const url = `http://localhost:8080/${param.id}/verify/${param.token}`;
	
	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				await axios.get(url);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param,url]);

  return (
    <>
    	{validUrl ? (
				<div className="">
					<h1>Email verified successfully</h1>
					<Link to="/">
						<button className="">Login</button>
					</Link>
				</div>
			) : (
			<Login/>
			)}
    </>
  )
}

export default VerifyEmail