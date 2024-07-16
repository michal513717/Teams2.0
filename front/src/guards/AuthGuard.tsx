import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = { component: React.FC };

const AuthGuard: React.FC<Props> = ({ component: Component }) => {
  const { user, authCheck } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      authCheck().then((val) => {
        if (val != 200) {
          navigate("/login");
        }
      });
    }
  }, [Component]);

  return <Component></Component>;
};

export default AuthGuard;
