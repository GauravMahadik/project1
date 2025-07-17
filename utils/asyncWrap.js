module.exports  = (fn)=>{
    return (res ,req ,next)=>{
        fn(res ,req ,next).catch(next);
    }
}


//so this wrap async function does same work as try and catch block.
//advantage over try and catch is that it just need to pass function or code of any page in it as argument
//thus reduce bulkness.
