import { ConversationComponent } from '../components/ConversationComponent'
import { InputMessageComponent } from '../components/InputMessageComponent'
import { Navbar } from '../components/Navbar'
export const Home = () => {
    return (
        <div>
            <Navbar/>
            <h1>Home page</h1>
            <ConversationComponent/>
            <InputMessageComponent/>
        </div>
    )
}