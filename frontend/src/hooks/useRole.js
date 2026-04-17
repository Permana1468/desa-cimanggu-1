import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useRole = () => {
    const { user } = useContext(AuthContext);
    
    const role = user?.role?.toUpperCase();
    
    return {
        role,
        isAdmin: role === 'ADMIN',
        isLPM: role === 'LPM',
        isSekdes: role === 'SEKDES',
        isKaurKeuangan: role === 'KAUR_KEUANGAN',
        isKaurPerencanaan: role === 'KAUR_PERENCANAAN',
        isKaurTU: role === 'KAUR_TU',
        isKasiPemerintahan: role === 'KASI_PEMERINTAHAN',
        isKasiKesejahteraan: role === 'KASI_KESEJAHTERAAN',
        isKasiPelayanan: role === 'KASI_PELAYANAN',
        isKadus: role === 'KADUS',
        isPosyandu: role === 'POSYANDU'
    };
};

export default useRole;
