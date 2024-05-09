import { FaCheck, FaExclamation } from "react-icons/fa6";

export const mutateProps = {
  loading: true,
  withCloseButton: false,
  autoClose: false,
};

export const successProps = {
  color: "teal",
  loading: false,
  autoClose: 3000,
  icon: <FaCheck />,
};

export const errorProps = {
  color: "red",
  loading: false,
  autoClose: 3000,
  icon: <FaExclamation />,
};
