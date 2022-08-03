import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageScroll = () => {

    const location = useLocation()

    useEffect(()=>{window.scrollTo({left:0,top:0,behavior:'smooth'});},[location])
    return ( <></> );
}
 
export default PageScroll;