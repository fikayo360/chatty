import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
  name: "user",
  initialState: {
    username:"",
    email:"",
    friends:[],
    _id:"",
    createdAt:"",
    city:"",
    sex:"",
    relationship:"",
    profilepic:""
  },
  reducers: {
    update(state,action){
     state.username = action.payload.username
     state.email = action.payload.email
     state.friends = action.payload.friends
     state._id = action.payload._id
     state.createdAt = action.payload.createdAt
     state.city = action.payload.city
     state.sex = action.payload.sex
     state.relationship = action.payload.relationship
     state.profilepic = action.payload.profilepic
    },
    addfriend(state,action){
      state.friends.push(action.payload)
    },
    removefriend(state,action){
      state.friends = state.friends.filter((item)=> item !== action.payload)
      console.log(state.friends)
    },
    updateprofile(state,action){
      state.city = action.payload.city
      state.sex = action.payload.sex
      state.relationship = action.payload.relationship
      state.profilepic = action.payload.profilepic
    },
    clearall(state){
      state.username = ""
      state.email = ""
      state.friends = []
      state._id = ""
      state.createdAt = ""
      state.city = ""
      state.sex = ""
      state.relationship = ""
      state.profilepic = ""
    }
  }
});

export const { update, addfriend,removefriend,updateprofile,clearall } = userSlice.actions;

export default userSlice.reducer;