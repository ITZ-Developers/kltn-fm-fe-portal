import { useRef, useEffect } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Loader,
  UserIcon,
} from "lucide-react";
import { getMediaImage } from "../../../services/utils";

const VideoRoom = ({
  conversation,
  connectionState,
  showWaiting,
  isVideoEnabled,
  isAudioEnabled,
  localVideoRef,
  remoteVideoRef,
  toggleTrack,
  handleLeaveRoom,
  connecting,
}: any) => {
  const localVideoContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (connectionState === "connecting" && localVideoContainerRef.current) {
      const interval = setInterval(() => {
        if (localVideoContainerRef.current) {
          const ripple = document.createElement("span");
          ripple.classList.add(
            "absolute",
            "inset-0",
            "border",
            "border-blue-500",
            "rounded-lg",
            "animate-ping",
            "opacity-75"
          );
          localVideoContainerRef.current.appendChild(ripple);

          setTimeout(() => {
            if (ripple && ripple.parentNode) {
              ripple.parentNode.removeChild(ripple);
            }
          }, 1500);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [connectionState]);

  const getConnectionStatus = () => {
    switch (connectionState) {
      case "connected":
        return { color: "bg-green-500", text: "Đã kết nối" };
      case "connecting":
        return { color: "bg-yellow-500", text: "Đang kết nối" };
      case "failed":
        return { color: "bg-red-500", text: "Kết nối thất bại" };
      case "disconnected":
        return { color: "bg-red-500", text: "Đã ngắt kết nối" };
      default:
        return { color: "bg-gray-500", text: "Đang chờ" };
    }
  };

  const status = getConnectionStatus();

  return (
    <div className="w-full flex flex-col h-full">
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium">
              Cuộc gọi video với:
            </span>
            <span className="text-white font-semibold">
              {conversation?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${status.color} animate-pulse`}
            ></span>
            <span className="text-white">{status.text}</span>
          </div>
        </div>
      </div>

      <div className="relative flex-grow bg-gray-950 overflow-hidden max-w-100 h-[calc(100vh-8rem)] max-h-[600px]">
        <div className="w-full h-full">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {showWaiting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 text-white">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />

                  {conversation?.avatar ? (
                    <img
                      src={getMediaImage(conversation?.avatar)}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-300">
                      <UserIcon className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                <p className="text-lg font-medium">
                  {`Đang chờ ${conversation?.name} tham gia...`}
                </p>
                <p className="text-gray-400 text-sm">Vui lòng chờ một chút</p>
              </div>
            </div>
          )}

          {connecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 text-white">
              <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin h-12 w-12 text-blue-500" />
                <p className="text-lg font-medium">
                  Establishing connection...
                </p>
                <p className="text-gray-400 text-sm">
                  Setting up your video call
                </p>
              </div>
            </div>
          )}

          {!showWaiting &&
            !remoteVideoRef.current?.srcObject &&
            !connecting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 text-white">
                <div className="flex flex-col items-center gap-4">
                  <Video className="h-16 w-16 text-gray-500" />
                  <p className="text-lg font-medium">No remote video</p>
                  <p className="text-gray-400 text-sm">
                    Waiting for the other participant's video
                  </p>
                </div>
              </div>
            )}
        </div>

        <div
          ref={localVideoContainerRef}
          className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg transition-all duration-300"
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${
              !isVideoEnabled ? "opacity-75 grayscale" : ""
            }`}
          />

          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
              <VideoOff className="h-8 w-8 text-red-500" />
            </div>
          )}

          <div
            className={`absolute top-2 left-2 p-1 rounded-full ${
              isAudioEnabled ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="h-4 w-4 text-green-400" />
            ) : (
              <MicOff className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 px-2 py-1 rounded text-xs font-medium text-gray-200">
            Bạn
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => toggleTrack("video")}
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ${
              isVideoEnabled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={() => toggleTrack("audio")}
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ${
              isAudioEnabled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            aria-label={
              isAudioEnabled ? "Mute microphone" : "Unmute microphone"
            }
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={handleLeaveRoom}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200"
            aria-label="End call"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
