
import { useContext } from 'react';
import AuthContext from '../contexts/AppContext'

export default function useAuth() {
    return useContext(AuthContext)
}
