import { useStateValue } from "../../StateProvider";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

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
                <div onClick={handleAuthentication} className='header__option'>
                    <a className='header__optionLineOne'>Hello {!user ? 'Guest' : user.email}</a>
                    <a className='header__optionLineTwo'>{user ? 'Sign Out' : 'Sign In'}</a>
                </div>
            </Link>
        </div>
    )
}

export default Header;