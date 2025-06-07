import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";


// Schema
const loginSchema = z.object({
  userid: z.string().min(1, "User Id is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginFormValues) => {
  try {
    //await login(data.userid, data.password);
    reset();
    console.log("Login successful!");
    navigate("/"); // ✅ Redirect here
  } catch (err) {
    console.error("Login failed:", err);
  }
};


  return (
    <div className="w-full md:w-1/2 flex justify-center bg-[#FFFFFF] py-[3%] h-[89vh] overflow-y-scroll">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold mb-1">Sign In</h2>
        <p className="text-gray-500 mb-2 text-sm">
          Welcome back! Please enter your credentials.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <Label htmlFor="userid">
              User Id<span className="text-red-500">*</span>
            </Label>
            <Input
              id="userid"
              type="text"
              placeholder="Enter User Id"
              {...register("userid")}
            />
            {errors.userid && (
              <p className="text-red-500 text-sm">{errors.userid.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">
              Password<span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="via-blue-700" name="remember" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="flex justify-center md:justify-end items-center">
            <Button
              type="submit"
              className="w-[300px] h-[50px] py-2 text-center text-white rounded-md bg-gradient-to-r from-cyan-400 to-green-500 hover:opacity-90 transition"
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
