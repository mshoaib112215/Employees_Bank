import react , { useState, useEffect } from "react";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getAvatar } from '../api/internal'

function useAutoLogin() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    // IIFE
    (async function autoLoginApiCall() {
      try {
        const response = await axios.get(
          // `https://192.168.83.48:3000/refresh`,
          `https://139.59.79.69:3000/refresh`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
          
        if (response.status === 200) {
          

          const avatar = await getAvatar(response.data.user._id)
          let avatarImage = '';
          if(avatar.data.result != null) {
            avatarImage = avatar.data.result.image;
          }
          // 1. setUser
          const user = {
            _id: response.data.user._id,
            email: response.data.user.email,
            username: response.data.user.username,
            name: response.data.user.name,
            role: response.data.user.role,
            auth: response.data.auth,
            avatar: avatarImage,
            createdAt: response.data.user.createdAt,
          };

          console.log(response)
          dispatch(setUser(user));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);

      }
    })();
  }, []);

  return loading;
}

export default useAutoLogin;
