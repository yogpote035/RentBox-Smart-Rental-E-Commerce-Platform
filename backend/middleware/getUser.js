const jwt = require("jsonwebtoken");

module.exports.getUser = (request, response, next) => {
  const token = request.header("token");

  if (!token) {
    return response.status(401).json({
      message: "Token Is Missing, Please Authenticate using Valid Token",
    });
  }

  

  try {
    const data = jwt.verify(token, process.env.secret);
    request.user = data.user;
    next();
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error : " + error,
    });
  }
};
