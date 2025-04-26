import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from '../lib/cloudinary.js' ;
import{ io ,getReceiverSocketId   } from '../lib/socket.js';
export const getUserForSideBar = async (req,res) =>{
try {
    const loggedInUserId = req.user._id ;
    const filtredUsers = await User.find({_id : {$ne:loggedInUserId}}).select("-password")
    res.status(200).json(filtredUsers)
} catch (error) {
    console.log("Error in message  controller", error.message)
    res.status(500).json({message :"Internal Server Error"})  
}

}




export const getMessages = async (req,res) =>{
 
    try {
        const {id :userToChatId} = req.params
        const  myId = req.user._id
        const messages = await Message.find({
            $or :
            [
            {senderId:myId , receiverId :userToChatId},
            {senderId:userToChatId , receiverId : myId}
        ]
    })
        res.status(200).json(messages) ;
    } catch (error) {
        console.log("Error in message  controller", error.message)
        res.status(500).json({message :"Internal Server Error"}) 
    }
}



export const sendMessage =async (req,res) =>{

    try {
    const {text , image} = req.body    
    const {id : receiverId} = req.params ;
    const senderId = req.user._id ;
    console.log("1" +req.body)   
    console.log("2" +receiverId)
    console.log("3" +senderId)
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
        const newMessage = new Message({
            senderId ,
            receiverId ,
            text ,
            image : imageUrl ,

        })
        
        await newMessage.save() ;
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    

    } catch (error) {
        console.log("Error in message  controller", error.message)
        res.status(500).json({message :"Internal Server Error"})        
    } 
}