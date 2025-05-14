const VideoRoom = ({
  currentRoom,
  connectionState,
  showWaiting,
  isVideoEnabled,
  isAudioEnabled,
  localVideoRef,
  remoteVideoRef,
  toggleTrack,
  handleLeaveRoom,
}: any) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Room: {currentRoom}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`fas fa-circle ${
                connectionState === "connected"
                  ? "text-green-500"
                  : connectionState === "connecting"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            ></span>
            <span>
              {connectionState === "connected"
                ? "Connected"
                : connectionState === "connecting"
                ? "Connecting"
                : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          {showWaiting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              Waiting for participants to join...
            </div>
          )}
        </div>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => toggleTrack("video")}
          className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${
            isVideoEnabled
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <i
            className={`fas ${isVideoEnabled ? "fa-video" : "fa-video-slash"}`}
          ></i>
        </button>
        <button
          onClick={() => toggleTrack("audio")}
          className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${
            isAudioEnabled
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <i
            className={`fas ${
              isAudioEnabled ? "fa-microphone" : "fa-microphone-slash"
            }`}
          ></i>
        </button>
        <button
          onClick={handleLeaveRoom}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoRoom;
