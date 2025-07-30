module.exports  = (fn)=>{
    return (req ,res ,next)=>{
        fn(req, res ,next).catch(next);
    }
}


//so this wrap async function does same work as try and catch block.
//advantage over try and catch is that it just need to pass function or code of any page in it as argument
//thus reduce bulkness.
