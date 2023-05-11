import axios from "../utils/axios"
export const upload=(data)=>{
    axios({
        url:"/v1/upload/file",
        method:"post",
        data
    })
}