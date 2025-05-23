import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

const FormCard = ({ title = "SAMPLE", children }: any) => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-[800px]">
      <h2 className="text-xl font-bold text-blue-500 mb-4">{title}</h2>
      {children}
    </div>
  );
};

const ModalForm = ({
  children,
  isVisible,
  onClose,
  title,
  blurAmount = "none",
  zIndex = 40,
}: any) => {
  const blurClass =
    (
      {
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
        "2xl": "backdrop-blur-2xl",
        none: "",
      } as any
    )[blurAmount] || "backdrop-blur-md";

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          style={{ zIndex }}
          className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center ${blurClass}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-lg p-8 border border-gray-800 max-w-lg w-full relative shadow-lg"
          >
            {onClose && (
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
                onClick={onClose}
              >
                <XIcon size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold mb-4 text-blue-500">{title}</h2>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ActionSection = ({ children }: any) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex flex-row space-x-2">{children}</div>
    </div>
  );
};

const BasicCardForm = ({ title = "Login", children, imgSrc }: any) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
    <div
      className={`w-full rounded-xl bg-gray-900/95 shadow-2xl backdrop-blur-sm flex overflow-hidden ${
        imgSrc ? "max-w-5xl" : "max-w-md"
      }`}
    >
      {imgSrc && (
        <div className="w-1/2 hidden md:block">
          <img
            src={imgSrc}
            className="h-full w-full object-contain"
            alt="Card illustration"
          />
        </div>
      )}
      <div className={imgSrc ? "w-full md:w-1/2 p-8" : "w-full p-8"}>
        <h2 className="mb-6 text-center text-2xl font-semibold text-blue-500">
          {title}
        </h2>
        {children}
      </div>
    </div>
  </div>
);

const ImageBase64 = ({ imgString }: any) => (
  <div className="flex mx-auto items-center justify-center w-[200px] h-[200px] border border-gray-600 bg-gray-800 rounded-md overflow-hidden">
    <img src={imgString} className="w-full h-full object-cover" />
  </div>
);

const HrefLink = ({ label = "SAMPLE", onClick }: any) => {
  return (
    <div className="text-right">
      <a
        onClick={onClick}
        className="text-sm font-semibold text-blue-500 hover:underline hover:cursor-pointer"
      >
        {label}
      </a>
    </div>
  );
};

export {
  FormCard,
  ActionSection,
  ModalForm,
  HrefLink,
  ImageBase64,
  BasicCardForm,
};
