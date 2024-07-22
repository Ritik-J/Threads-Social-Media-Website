import jsonwebtoken from "jsonwebtoken"

const tokenAndCookie = (userId, res) => {
const token = jsonwebtoken.sign({userId},process.env.JWT_SECRET, {
    expiresIn: '15d'
})

res.cookie("jwt", token,{
    httpOnly: true,     //make more secure 
    maxAge: 15 * 24 * 60 * 60 * 1000,    //maximum age or time 
    sameSite: "strict"  
})

return token;
}

export default tokenAndCookie