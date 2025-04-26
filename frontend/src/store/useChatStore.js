import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set,get)=>({
messages :[],
users :[],
selectedUser : null ,
isUsersLoading : false ,
isMessagesLoading: false ,
getUsers : async()=>{
    set({isUsersLoading : true } );
    try {
        const res = await axiosInstance.get("/messages/users");
       
        set({users : res.data}) ;
    
       

        
    } catch (error) {
        toast.error(error.response.data.message);
        
    } finally {
        set({isUsersLoading :false})
    }
} ,
getMessages: async(userId)=>{
    set({isMessagesLoading : true });
    try {
        const res = await axiosInstance.get(`/messages/all/${userId}`) 
        set({messages: res.data})  
    } catch (error) {
        toast.error(error.response.data.message);
        
    } finally {
        set({isMessagesLoading :false})
    }
        
  
 
},
sendMessage : async(messageData)=>{
    try {
      const {selectedUser, messages} = get();  
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({messages: [...messages,res.data]})
    } catch (error) {
        toast.error(error.response.data.message);
    }

},
subscribeToMessages : ()=>{
    const{selectedUser}=get();
    if(!selectedUser) return ;
    const socket = useAuthStore.getState().socket;
    if(newMessage.senderId !== selectedUser._id) return ; 
    socket.on("newMessage" , (newMessage)=>{
        set({
            messages : [...get().messages, newMessage]
        });
    })

},
unsubscribeFromMessages :()=>{

    const socket = useAuthStore.getState().socket;
    socket.off("newMessage")
},
setSelectedUser: (selectedUser) => set({ selectedUser }),



}))