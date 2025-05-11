import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import useCurrentUser from "../hooks/useCurrentUser";
import Avatar from "./Avatar";
import { Bell } from "lucide-react";

export default function NotificationSettingsDemo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const { user } = useCurrentUser();
  const settingsRef = useRef<HTMLLIElement>(null);

  // Auto-play animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlaying(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle animation steps
  useEffect(() => {
    if (!playing) return;

    if (step === 0) {
      setEnabled(false);
    }

    if (step < 5) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setPlaying(false);
      setCompleted(true);
    }

    if (step === 5) {
      // Simulate enabling notifications
      setEnabled(true);
    }
  }, [step, playing]);

  const resetDemo = () => {
    setStep(0);
    setCompleted(false);
    setPlaying(true);
  };

  return (
    <div className="flex flex-col h-86 items-center w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-full relative" style={{ height: "400px" }}>
        {/* Browser interface */}
        <div className="absolute inset-0 flex flex-col">
          {/* Browser address bar using your navbar layout */}
          <div className="flex items-center bg-gray-100 p-2 border-b border-gray-200">
            <div className="navbar flex items-center justify-between w-full">
              <div className="navbar__placeholder w-4" />

              <Logo className="navbar__logo mx-2" />

              <div className="flex items-center gap-3">
                <details
                  open={step === 2 || step === 3 /* or step >= 3 */}
                  className="dropdown navbar__menu relative"
                >
                  {/* highlight the avatar in step 1 */}
                  <summary role="menu" className="list-none cursor-pointer">
                    <Avatar user={user} className="navbar__avatar" />
                    {/* ping indicator in step 1 */}
                    {step <= 1 && (
                      <span className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></span>
                    )}
                  </summary>
                  <ul
                    dir="rtl"
                    className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md overflow-hidden p-1 z-10"
                  >
                    <li className="px-3 py-2 hover:bg-gray-100 rounded">
                      Profile
                    </li>
                    <li
                      ref={settingsRef}
                      className={`px-3 py-2 relative hover:bg-gray-100 rounded ${
                        step === 3 ? "bg-blue-50" : ""
                      }`}
                      tabIndex={-1}
                    >
                      <span className="absolute -top-1 left-1 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></span>
                      Settings
                    </li>
                    <li className="px-3 py-2 hover:bg-gray-100 rounded">
                      History
                    </li>
                    <li className="px-3 py-2 hover:bg-gray-100 rounded">
                      Reviews
                    </li>
                    <li className="px-3 py-2 hover:bg-gray-100 rounded">
                      Logout
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white p-4 relative">
            {step > 3 && (
              <div>
                <h2>Settings</h2>
                <article className="user-settings">
                  <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center space-x-2">
                      <Bell className="text-gray-600" size={20} />
                      <span className="font-medium text-gray-700">
                        Allow Notifications
                      </span>
                    </div>

                    <span
                      onClick={() => setEnabled(!enabled)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        enabled ? "bg-blue-500" : "bg-gray-300"
                      } `}
                    >
                      <span
                        className={`transform transition-transform bg-white w-5 h-5 rounded-full shadow ${
                          enabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </span>

                    {step < 5 && (
                      <span className="absolute top-3 right-9 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></span>
                    )}
                  </div>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full p-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Step {step + 1} of 6:{" "}
            {step === 0
              ? "App loaded"
              : step === 1
              ? "Click notification bell"
              : step === 2
              ? "Open settings menu"
              : step === 3
              ? "Click notification settings"
              : step === 4
              ? "Enable notifications"
              : "Notifications enabled"}
          </div>

          <div className="flex items-center space-x-2">
            {completed ? (
              <button
                onClick={resetDemo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Replay Demo
              </button>
            ) : (
              <button
                onClick={() => setPlaying(!playing)}
                className={`px-4 py-2 ${
                  playing ? "bg-gray-500" : "bg-blue-500"
                } text-white rounded hover:opacity-90 text-sm`}
              >
                {playing ? "Pause" : "Play"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

