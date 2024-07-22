import { atom } from "recoil";

export const conversationAtom = atom({
  key: "conversationAtom",
  default: [],
});

export const selectConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});
