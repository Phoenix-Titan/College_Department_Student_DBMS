const SignUpUser = (req,res)=>{
    console.log(req.body)
    const {Username, Password} = req.body

    res.status(200).json({
        meg: "User Sucessfully created.",
        user:  `Username: ${Username} , Password: ${Password}`
    })
}

export { SignUpUser }