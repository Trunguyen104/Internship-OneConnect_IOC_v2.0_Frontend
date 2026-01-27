import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const primaryColor = "#c53030";
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Login success:", { email, password });
            // call API 
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden"
            style={{
                background: `radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65% )`
            }} >

            <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
                {/* LEFT */}
                <div className="flex items-center justify-center px-4 lg:pr-1">

                    <div className="w-full max-w-[500px]">
                        <img
                            className="block mx-auto mb-8 w-[200px]"
                            src="https://iocv2.rikkei.edu.vn/logo.svg"
                            alt=""
                        />

                        <p className="text-center font-bold text-5xl text-black mb-8">
                            LOGIN
                        </p>

                        <p className="text-center text-gray-500 mb-4">
                            Please enter your details to sign in.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-900 text-left">
                                    Email address <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@university.edu"
                                    className={`w-full px-3 py-2 rounded-xl border
                    ${errors.email
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                        }
                    focus:outline-none focus:ring-2`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-left text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-900">
                                        Password <span className="text-red-500">*</span>
                                    </label>

                                    <a
                                        href="#"
                                        className="text-xs"
                                        style={{ color: primaryColor }}
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-3 py-2 rounded-xl border
                    ${errors.password
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                        }
                    focus:outline-none focus:ring-2`}
                                />
                                {errors.password && (
                                    <p className="text-left mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4 flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 text-sm text-gray-900"
                                >
                                    Remember this device
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-[46px] rounded text-white font-semibold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Sign In
                            </button>

                            <div className="mt-4 text-center text-sm text-gray-600">
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="font-semibold hover:underline"
                                    style={{ color: primaryColor }}
                                >
                                    Register
                                </button>
                            </div>

                        </form>

                        <div className="text-center text-gray-500 text-sm mt-4">
                            © 2025 Internship OneConnect
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="hidden lg:flex items-center justify-center p-8">

                    <div
                        className="w-full max-w-[700px] h-full max-h-[90vh]
               rounded-[32px] px-10 py-12
               flex flex-col items-center justify-between
               shadow-xl"
                        style={{ backgroundColor: primaryColor }}
                    >

                        <div className="text-center text-white">
                            <h2 className="text-4xl font-extrabold mb-4">
                                Internship OneConnect
                            </h2>

                            <p className="text-white/80 text-sm leading-relaxed max-w-[420px] mx-auto">
                                Join an internship program to learn from experts, hone practical skills, and prepare yourself for a successful future career.
                            </p>
                        </div>

                        <div className="mt-6">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5z7obhQSvKryJhTKFqw0M1E44M72vpJQ8MrUn1rp3X56SAkBl0ffctPFrzoj2i61Wp96qD5e4avoX1vIHj28wLm8hqxOB0W6Afwj35qKTu7xk0vdZIf3ceu6RQF5dU2Skl8IjLhakSs4RNK7TmJz2W45aXrA7LRvWArmw2w_klVzBZ-vDQXp_BRjrvOBz9heN_NS_JmPSNiypkSv1W-7zT0ACy9XAs1O--Bwha0XPWEEzWgUMB5OGFRkL5-HwQAlclrj3bXaaOho"
                                alt="Mascot"
                                className="max-w-[400px] object-contain mx-auto rounded-4"
                            />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
