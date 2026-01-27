import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const primaryColor = "#c53030";
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (role === "student" && !form.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (role === "enterprise" && !form.companyName.trim())
      newErrors.companyName = "Company name is required";

    if (!form.email.trim())
      newErrors.email = "Email is required";

    if (!form.password)
      newErrors.password = "Password is required";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Register:", { role, ...form });
    }
  };

  return (
    <div className="w-full h-screen"
      style={{
        background: `radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65% )`
      }} >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

        {/* LEFT */}
        <div className="flex items-center justify-center px-6">
          <div className="w-full max-w-[480px]">

            <img
              src="https://iocv2.rikkei.edu.vn/logo.svg"
              className="mx-auto mb-6 w-[180px]"
              alt=""
            />

            <h1 className="text-center font-bold text-4xl mb-4">
              REGISTER
            </h1>

            <p className="text-center text-gray-500 mb-4 text-sm">
              Create your account to get started.
            </p>

            {/* ROLE */}
            <div className="flex justify-center gap-6 mb-6">
              {["student", "enterprise"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium
                    ${role === r
                      ? "text-white"
                      : "text-gray-600 border-gray-300"
                    }`}
                  style={
                    role === r ? { backgroundColor: primaryColor } : {}
                  }
                >
                  {r === "student" ? "Student" : "Enterprise"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {role === "student" && (
                <Input
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
              )}

              {role === "enterprise" && (
                <Input
                  label="Company Name"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                />
              )}

              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <button
                type="submit"
                className="w-full h-[46px] rounded-xl text-white font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                Create Account
              </button>
              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold hover:underline"
                  style={{ color: primaryColor }}
                >
                  Login
                </button>
              </div>

            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              © 2025 Internship OneConnect
            </p>
          </div>
        </div>

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

/* ---------- REUSABLE INPUT ---------- */
function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...props}
        className={`w-full px-3 py-1.5 rounded-lg border
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
