import { useStateValue } from "../../contexts/StateProvider";
import { auth } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import '../../styles/Chat.css'

function Header() {
    const [{ user }] = useStateValue();

    const handleAuthentication = () => {
        if (user) {
            auth.signOut().then(() => {
                window.location.reload(); 
            });
        }
    }

    return (
        <div className='header'>
            <Link to={!user && '/'}>
                <div onClick={handleAuthentication} className='header-option'>
                    <span className='header-optionLineOne'>Hello {!user ? 'Guest' : user.email}</span>
                    <span className='header-optionLineTwo'>{user ? 'Sign Out' : 'Sign In'}</span>
                </div>
            </Link>
        </div>
    )
}

export default Header;