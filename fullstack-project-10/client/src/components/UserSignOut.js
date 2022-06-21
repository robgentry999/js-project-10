import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserSignOut({ context }) {
    const navigate = useNavigate();
    useEffect( ()=>{
        context.actions.signOut();
        navigate( '/' );
    }, []);
    return null;
}