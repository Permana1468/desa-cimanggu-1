import React from 'react';
import Modal from '../../components/Shared/Modal';

const FormInput = ({ label, name, type = "text", required, placeholder, value, onChange, info }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">{label}</label>
            {required && <span className="text-[9px] text-gold font-bold uppercase tracking-widest">Required</span>}
        </div>
        <input
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] 
                       placeholder:text-text-quaternary outline-none transition-all duration-300
                       focus:border-gold-border focus:bg-gold-light focus:shadow-gold-glow"
        />
        {info && <p className="text-[10px] text-text-tertiary italic mt-1.5 leading-relaxed">{info}</p>}
    </div>
);

const UserFormModal = ({ isModalOpen, setIsModalOpen, modalMode, UserPlus, Settings2, isSaving, handleSubmit, formData, handleChange, roleOptions, roleLabels, theme, ShieldAlert, setFormData }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalMode === 'add' ? 'Tambah Akun Pengguna' : 'Update Data Akun'}
            icon={modalMode === 'add' ? UserPlus : Settings2}
            footer={
                <>
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-text-tertiary hover:text-text-main transition-colors">Batal</button>
                    <button type="submit" form="userForm" disabled={isSaving} className="bg-gold hover:bg-gold-dark text-black px-8 py-3.5 rounded-2xl font-black text-[14px] shadow-gold-glow">
                        {isSaving ? 'MEMPROSES...' : 'SIMPAN DATA'}
                    </button>
                </>
            }
        >
            <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
                <FormInput label="Username User" name="username" required value={formData.username} onChange={handleChange} placeholder="Contoh: kaur_umum" />
                <FormInput label="Alamat Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="user@cimanggu.desa.id" />
                
                <FormInput 
                    label="Password Keamanan" 
                    name="password" 
                    type="password" 
                    required={modalMode === 'add'} 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder={modalMode === 'add' ? 'Minimal 8 karakter' : 'Ganti jika diperlukan'}
                    info={modalMode === 'add' ? "Gunakan kombinasi simbol dan angka untuk keamanan maksimal." : "Kosongkan kolom jika Anda tidak ingin merubah password."}
                />

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldAlert size={14} className="text-red-500" />
                        Role Sistem & Hak Akses
                    </label>
                    <select
                        name="role" required
                        value={formData.role} onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] outline-none appearance-none cursor-pointer focus:border-gold-border"
                    >
                        {roleOptions.map(r => (
                            <option key={r} value={r} className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>{roleLabels[r] || r}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">Status Akun</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] outline-none appearance-none cursor-pointer focus:border-gold-border"
                        >
                            <option value="ACTIVE" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>ACTIVE (Aktif)</option>
                            <option value="PENDING" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>PENDING (Ditangguhkan)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">Verifikasi</label>
                        <select
                            name="is_verified"
                            value={formData.is_verified}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.value === 'true' }))}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] outline-none appearance-none cursor-pointer focus:border-gold-border"
                        >
                            <option value="true" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>VERIFIED</option>
                            <option value="false" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>UNVERIFIED</option>
                        </select>
                    </div>
                </div>

                <FormInput 
                    label="Keterangan Unit (Wilayah/Jabatan)" 
                    name="unit_detail" 
                    value={formData.unit_detail} 
                    onChange={handleChange} 
                    placeholder={formData.role === 'RT' ? 'Contoh: RW 01 / RT 05' : 'Contoh: Dusun I'} 
                    info="Format wajib RT/RW: RW 01 / RT 01"
                />
            </form>
        </Modal>
    );
};

export default UserFormModal;
