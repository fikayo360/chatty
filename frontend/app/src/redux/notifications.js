import { createSlice } from "@reduxjs/toolkit";


export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications:[]
  },
  reducers: {
    addnotification(state,action){
    console.log(action.payload)
      state.notifications.push(action.payload)
    },
    clearnots(state){
        state.notifications = []
    } 

  }
});

export const { addnotification,clearnots } = notificationSlice.actions;

export default notificationSlice.reducer;