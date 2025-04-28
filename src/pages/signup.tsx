import { useState, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation basique
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    // Validation du mot de passe
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      // Obtenez d'abord le cookie CSRF
      console.log("Fetching CSRF cookie...");
      await axiosClient.get("/sanctum/csrf-cookie");

      // Préparation des données pour l'API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password, // Laravel demande généralement une confirmation
        role: userType, // student ou teacher
      };

      console.log("Sending registration data:", userData);

      // Appel API pour l'inscription
      const response = await axiosClient.post("/api/register", userData);

      console.log("Registration response:", response);

      if (response.status === 201 || response.status === 200) {
        // Si l'API renvoie le token et les informations utilisateur directement
        if (response.data.token && response.data.user) {
          const { user, token } = response.data;
          console.log("Auto-login after registration");

          // Connectez l'utilisateur immédiatement
          useAuth.getState().login(user, token);

          // Redirection vers la page d'accueil ou tableau de bord
          navigate("/");
        } else {
          // Sinon, redirigez vers la page de connexion
          alert("Registration successful! Please login.");
          navigate("/login");
        }
      }
    } catch (error: any) {
      console.error("Registration failed:", error);

      // Affichage des erreurs de validation renvoyées par le backend
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        alert(`Registration error: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <>
      {/* Contenu principal */}
      <div className="min-h-screen flex flex-col bg-white">
        <main className="container mx-auto px-4 py-8 md:py-16 overflow-visible flex-1">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Section Témoignages */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#333333]">
                Students Testimonials
              </h2>
              <p className="text-[#656567]">
                Lorem ipsum dolor sit amet consectetur...
              </p>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
                <p className="text-[#333333] mb-6">
                  The web design course provided a solid foundation for me...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#F1F1F3] w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src="/avatar-placeholder.png"
                        alt="Student avatar"
                        width={40}
                        height={40}
                      />
                    </div>
                    <span className="font-medium text-[#333333]">Sarah L.</span>
                  </div>
                  <Button
                    variant="link"
                    className="text-[#FF9500] hover:text-[#e68600]"
                  >
                    Read More
                  </Button>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 border-gray-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 border-gray-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Section Formulaire */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
                <p className="text-center text-[#656567] mb-6">
                  Create an account to unlock exclusive features.
                </p>

                {/* Champ Nom Complet */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Entrer votre prénom"
                    className="border-gray-200"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="laststName"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Entrer votre prénom"
                    className="border-gray-200"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Champ Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    className="border-gray-200"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Select pour Type d'utilisateur */}
                <div className="space-y-2">
                  <label
                    htmlFor="userType"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    I want to register as
                  </label>
                  <div className="relative">
                    <select
                      id="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 appearance-none pr-10 h-10 text-gray-800"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className="border-gray-200 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Case à cocher pour les conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeToTerms: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-[#656567]"
                  >
                    I agree with{" "}
                    <a href="#" className="text-[#333333] underline">
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#333333] underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Bouton d'inscription */}
                <Button
                  type="submit"
                  className="w-full bg-[#FF9500] hover:bg-[#e68600] text-white"
                >
                  Sign Up as {userType === "student" ? "Student" : "Teacher"}
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 absolute w-full"></div>
                  <span className="bg-white px-2 relative text-sm text-[#656567]">
                    OR
                  </span>
                </div>

                {/* Inscription avec Google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-200 flex items-center gap-2"
                >
                  <img
                    src="/google-logo.png"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span>Sign up with Google</span>
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Signup;
