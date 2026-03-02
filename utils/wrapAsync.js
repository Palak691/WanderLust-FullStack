module.exports = (fn)=> {//take function in param
    return (req,res,next) => { //returns another function
        fn(req,res,next).catch(next);// run the param function
        // If async function fails 
        // Error goes to next(err)
        // Express error middleware handles it
    }
}