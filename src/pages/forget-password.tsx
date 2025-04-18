import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import  axiosClient from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Schéma de validation Zod
const ForgetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgetPasswordForm = z.infer<typeof ForgetPasswordSchema>;

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordForm>({
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordForm) => {
    try {
      // Get CSRF cookie first
      await axiosClient.get('/sanctum/csrf-cookie');
      
      // Send forget password request
      const response = await axiosClient.post('/api/forgot-password', {
        email: data.email,
      });

      if (response.status === 200) {
        setIsSuccess(true);
        // Rediriger après 2 secondes (2000ms au lieu de 200000ms)
        setTimeout(() => {
          navigate('/forgot-password/confirmation');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Password reset request failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center p-6 lg:p-10 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            {/* Logo */}
            <div className="bg-[#ff9500] h-16 w-16 rounded-md flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Forgot your password?
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ff9500] hover:bg-[#e68600]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>

            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="w-full text-[#ff9500] hover:text-[#e68600]"
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}