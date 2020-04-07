module.exports = {
    send: (error, res, code=400)=>{
        console.log(`Error: ${error}`);

        res.status(code).json({ error });
    }
}