const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
   try {

        const AuthHeader = req.get('Authorization');
        //console.log(AuthHeader);

        if(!AuthHeader) {
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const token = AuthHeader.split(' ')[1];

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, 'usersecretprivatekey')
            console.log(decodedToken);
        } catch(error) {
            throw error;
        }

        if (!decodedToken) {
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            throw error; 
        }

        req.userId = decodedToken.userId;
        req.email = decodedToken.email;

    } catch (error) {
    next(error);
   }
    next();
}