
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, { // this gonna take userId of the user and secret key and then gonna create a unique 
    //  token for that user
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	res.cookie("jwt", token, { // token are then stored in browser cookie using res.cookie so to access token use res.cookie.jwt
		httpOnly: true, // more secure ensure the cookie are not accessible by js
		maxAge:  parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000, 
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict',//CSRF
	});

	return token;
};

export default generateTokenAndSetCookie;


