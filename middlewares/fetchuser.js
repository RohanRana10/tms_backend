const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    try {
        let authtoken = req.header('authtoken');

        //check if authtoken exists in the header
        if (!authtoken) {
            return res.status(401).json({ error: "please authenticate using a valid token" });
        }

        //verify and send the user in the request
        const data = jwt.verify(authtoken, jwtSecret);
        req.user = data.user;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("error fetching authtoken: ", error);
        res.status(401).json({ error: "please authenticate using a valid token" });
    }

}

module.exports = fetchuser;