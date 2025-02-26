import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"
export const Signin=() =>{
    return(
        <div>
         <div>
            <Auth type="signin"></Auth>
        </div>
         <div className="hidden lg:block">
            <Quote></Quote>
         </div>
        </div>
    )
}