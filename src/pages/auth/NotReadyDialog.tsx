const NotReadyDialog = ({ color, message, title }: any) => {
  return (
    <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="relative">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2
            className="text-xl font-bold mb-2 text-gray-200"
            style={{ color }}
          >
            {title}
          </h2>
          <p className="text-base text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotReadyDialog;
