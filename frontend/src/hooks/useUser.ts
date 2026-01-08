// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useSessionStorage } from "./useSessionStorage";

// // NOTE: optimally move this into a separate file
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   authToken?: string;
// }

// export const useUser = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const { setItem } = useSessionStorage();

//   const addUser = (user: User) => {
//     setUser(user);
//     setItem("user", JSON.stringify(user));
//   };

//   const removeUser = () => {
//     setUser(null);
//     setItem("user", "");
//   };

//   return { user, addUser, removeUser, setUser };
// };