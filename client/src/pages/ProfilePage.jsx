import React, { useState } from "react";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";

const ProfilePage = () => {

    const { user, axios, navigate } = useAppContext();

    const initialProfile = {
        username: user ? user.username : "User",
        first_name: user ? user.first_name : "User",
        last_name: user ? user.last_name : "Name",
        email: user ? user.email : "",
        avatarUrl: user ? user.image : "",
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        const first = parts[0]?.[0] ?? "";
        const last = parts[1]?.[0] ?? "";
        return (first + last || first).toUpperCase();
    };

    const [activeMenu, setActiveMenu] = useState("profile");
    const [profile, setProfile] = useState(initialProfile);
    const [editForm, setEditForm] = useState(initialProfile);
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    // === Edit Profil ===
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!editForm.username.trim()) return alert("Username wajib diisi");
        if (!editForm.first_name.trim()) return alert("Nama depan wajib diisi");
        if (!editForm.last_name.trim())
            return alert("Nama belakang wajib diisi");
        if (!editForm.email.trim()) return alert("Email wajib diisi");

        try {
            const { data } = await axios.post("/api/user/profile", editForm, { withCredentials: true });

            if (data.succes) {
                toast.success("Profil berhasil perbaharui");
                navigate(0); // refresh halaman
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }

    };

    // === Ubah Password ===
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (
            !passwordForm.current ||
            !passwordForm.newPass ||
            !passwordForm.confirm
        ) {
            return toast.error("Semua field password wajib diisi");
        }
        if (passwordForm.newPass !== passwordForm.confirm) {
            return toast.error("Konfirmasi password baru tidak sama");
        }

        try {
            const { data } = await axios.post("/api/user/update-password", {
                oldPassword: passwordForm.current,
                newPassword: passwordForm.newPass
            }, { withCredentials: true });

            if (data.succes) {
                setPasswordForm({ current: "", newPass: "", confirm: "" });
                toast.success("Password berhasil diubah");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
        }

    };

    // === Upload / Ganti Foto Profil ===
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Silakan pilih file gambar (JPG/PNG).");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result?.toString() || "";
            setProfile((prev) => ({ ...prev, avatarUrl: dataUrl }));
            // kalau lagi di edit mode, sinkron juga ke form edit
            setEditForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
        };
        reader.readAsDataURL(file);
    };

    // state untuk preview foto
    const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);

    return (
        <div>
            <div className="max-w-8xl mx-auto px-6 py-8">
                <div className="flex gap-6">
                    {/* SIDEBAR AKUN SAYA */}
                    <aside className="w-64 bg-white rounded-lg border border-slate-200 shadow-sm h-fit">
                        {/* mini profile di sidebar */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-semibold overflow-hidden">
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>{getInitials(profile.first_name + " " + profile.last_name)}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {profile.username}
                                </p>
                            </div>
                        </div>

                        <nav className="py-3 text-sm">
                            <p className="px-5 py-2 text-xs font-semibold text-slate-400 uppercase">
                                Akun Saya
                            </p>

                            {/* 1. PROFIL (DETAIL SAJA, TIDAK BISA EDIT) */}
                            <button
                                type="button"
                                onClick={() => setActiveMenu("profile")}
                                className={`w-full text-left px-5 py-2 ${activeMenu === "profile"
                                    ? "text-tombol font-medium bg-tombol/10"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Profil
                            </button>

                            {/* 2. EDIT PROFIL (SEMUA BISA DIUBAH) */}
                            <button
                                type="button"
                                onClick={() => {
                                    setEditForm(profile); // isi form dengan data terbaru
                                    setActiveMenu("edit");
                                }}
                                className={`w-full text-left px-5 py-2 ${activeMenu === "edit"
                                    ? "text-tombol font-medium bg-tombol/10"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Edit Profil
                            </button>

                            {/* 3. UBAH PASSWORD */}
                            <button
                                type="button"
                                onClick={() => setActiveMenu("password")}
                                className={`w-full text-left px-5 py-2 ${activeMenu === "password"
                                    ? "text-tombol font-medium bg-tombol/10"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Ubah Password
                            </button>
                        </nav>
                    </aside>

                    {/* KONTEN UTAMA */}
                    <main className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col gap-3 items-center lg:flex-row">
                        {/* PANEL TENGAH */}
                        <section className="flex-1 px-8 py-6">
                            {activeMenu === "profile" && (
                                <>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Profil
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 mb-6">
                                        Halaman ini hanya menampilkan detail profil. Untuk mengubah
                                        data gunakan menu <b>Edit Profil</b>.
                                    </p>

                                    <div className="space-y-4 max-w-xl text-sm">
                                        <div className="flex">
                                            <span className="w-40 pr-4 text-slate-500">Username</span>
                                            <p className="flex-1 text-slate-900">
                                                {profile.username}
                                            </p>
                                        </div>

                                        <div className="flex">
                                            <span className="w-40 pr-4 text-slate-500">Nama</span>
                                            <p className="flex-1 text-slate-900">
                                                {profile.first_name} {profile.last_name}
                                            </p>
                                        </div>

                                        <div className="flex">
                                            <span className="w-40 pr-4 text-slate-500">Email</span>
                                            <p className="flex-1 text-slate-900">{profile.email}</p>
                                        </div>

                                    </div>
                                </>
                            )}

                            {activeMenu === "edit" && (
                                <>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Edit Profil
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 mb-6">
                                        Di sini Anda bisa mengubah username, nama, email, dan foto profil.
                                    </p>

                                    <form
                                        onSubmit={handleSaveProfile}
                                        className="space-y-4 max-w-xl"
                                    >
                                        {/* Username */}
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="username"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Username
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    value={editForm.username}
                                                    onChange={handleEditChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Nama */}
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="name"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Nama Depan
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="first_name"
                                                    name="first_name"
                                                    type="text"
                                                    value={editForm.first_name}
                                                    onChange={handleEditChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="name"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Nama Belakang
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="last_name"
                                                    name="last_name"
                                                    type="text"
                                                    value={editForm.last_name}
                                                    onChange={handleEditChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="email"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Email
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={handleEditChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Tombol Simpan */}
                                        <div className="flex items-center pt-4">
                                            <div className="w-40" />
                                            <button
                                                type="submit"
                                                className="px-6 h-9 rounded bg-orange-500 text-white text-sm font-medium hover:bg-orange-600"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {activeMenu === "password" && (
                                <>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Ubah Password
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 mb-6">
                                        Atur ulang password akun Anda.
                                    </p>

                                    <form
                                        onSubmit={handleSavePassword}
                                        className="space-y-4 max-w-xl"
                                    >
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="current"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Password Sekarang
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="current"
                                                    name="current"
                                                    type="password"
                                                    value={passwordForm.current}
                                                    onChange={handlePasswordChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <label
                                                htmlFor="newPass"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Password Baru
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="newPass"
                                                    name="newPass"
                                                    type="password"
                                                    value={passwordForm.newPass}
                                                    onChange={handlePasswordChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <label
                                                htmlFor="confirm"
                                                className="w-40 text-right pr-4 text-sm text-slate-600"
                                            >
                                                Konfirmasi Password
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    id="confirm"
                                                    name="confirm"
                                                    type="password"
                                                    value={passwordForm.confirm}
                                                    onChange={handlePasswordChange}
                                                    className="w-full h-10 px-3 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center pt-4">
                                            <div className="w-40" />
                                            <button
                                                type="submit"
                                                className="px-6 h-9 rounded bg-tombol text-white text-sm font-medium hover:bg-primary"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </section>

                        {/* PANEL KANAN: PILIH GAMBAR */}
                        <aside className=" w-64 px-6 py-6 flex flex-col items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (profile.avatarUrl) setIsAvatarPreviewOpen(true);
                                }}
                                className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center
                           text-teal-700 text-2xl font-semibold overflow-hidden border border-slate-200
                           hover:ring-2 hover:ring-teal-400 hover:ring-offset-2 hover:ring-offset-white
                           transition-shadow cursor-pointer"
                            >
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>{getInitials(profile.first_name + " " + profile.last_name)}</span>
                                )}
                            </button>
                            <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded border border-slate-300 bg-slate-50 text-sm text-slate-700 hover:bg-slate-100">
                                Pilih Gambar
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                            <p className="text-[11px] text-slate-400 text-center leading-snug">
                                Ukuran gambar maks. 1 MB
                                <br />
                                Format gambar: .JPEG, .PNG
                            </p>
                        </aside>
                    </main>
                </div>
            </div>

            {/* overlay untuk menampilkan foto besar */}
            {isAvatarPreviewOpen && profile.avatarUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setIsAvatarPreviewOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-4 max-w-lg w-[90%] md:w-auto"
                        onClick={(e) => e.stopPropagation()} // supaya klik di gambar tidak menutup
                    >
                        <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="max-h-[70vh] max-w-full object-contain rounded-md"
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                type="button"
                                onClick={() => setIsAvatarPreviewOpen(false)}
                                className="px-4 py-1.5 rounded-md text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;