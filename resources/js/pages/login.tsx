const login = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <img src="/assets/125th_LOGO.webp" alt="logo" className="max-w-40" />
            <fieldset className="fieldset w-xs rounded-box border border-base-300 bg-base-200 p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Username</label>
                <input type="text" className="input" placeholder="Username" />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" />

                <button className="btn mt-4 btn-neutral">Login</button>
            </fieldset>
        </div>
    );
};

export default login;
