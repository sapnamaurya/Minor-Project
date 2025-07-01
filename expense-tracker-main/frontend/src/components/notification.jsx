import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CHECK_INTERVAL = 6 * 60 * 1000; // 6 minutes

export const ExpenseChecker = () => {
  useEffect(() => {
    const checkTotalLimit = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:4000/api/expenses/checkUserTotalLimit",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("res--", res, res.data.alert);
        const updatedAlertmsg = res.data.alert.includes("of 0!")
          ? res.data.alert.replace("0!", "100000!")
          : res?.data?.alert;

        if (updatedAlertmsg) {
          toast.warn(updatedAlertmsg, {
            position: "top-right",
            autoClose: 8000,
          });
        }
      } catch (error) {
        console.error("Error checking total monthly limit:", error);
      }
    };

    checkTotalLimit();
    const interval = setInterval(checkTotalLimit, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return null;
};
