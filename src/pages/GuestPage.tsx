import { CustomButton as Button } from "../components/atoms/CustomButton"; 
import { useNavigate } from "react-router-dom";
import Typography from "../components/atoms/Typography";
import { motion } from "framer-motion";

const GuestPage:React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-full flex flex-col items-center justify-between px-6 py-12 transition-colors duration-500 dark:bg-gray-900 'bg-white text-gray-900'}`}>


      {/* Hero Section */}
      <motion.section 
        className="text-center flex flex-col items-center gap-6 mt-24 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Typography className="text-4xl  md:text-5xl font-extrabold leading-tight">
          AI-powered GitHub Repository Insights
        </Typography>
        <Typography code className="text-lg md:text-xl ">
          Sourcely helps developers instantly analyze public GitHub repos using smart AI summarization and code insights.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button onClick={() => navigate("/login")}>Sign In</Button>
          <Button variant="outlined" onClick={() => navigate("/register")}>Create Account</Button>
        </div>
      </motion.section>
    </div>
  );
}

export default GuestPage;