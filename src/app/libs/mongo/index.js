import mongoose from "mongoose";
const URI = process.env.MONGODB_URI;
if(!URI) throw new Error("Please add Mongo URI");
 const connect = async ()=> {
	try{
	const connection = await mongoose.connect(URI,{
		useNewUrlParser: true,
useUnifiedTopology: true
	});
    return connection;
}
catch(error){
	console.log(error)
}
	
}
export default connect;
