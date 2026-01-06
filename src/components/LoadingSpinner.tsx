import { FaSpinner } from "react-icons/fa";

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );
};
