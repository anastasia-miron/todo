import { useState } from "react";
import { MessageSquare, Search, Filter } from "lucide-react";
import { useMessages } from "../context/MessageContext";
import Avatar from "../components/Avatar";
import { Link, useNavigate } from "react-router";
import { UserModel } from "../typings/models";
import apiService from "../services/api.service";

// Format the timestamp
function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Acum";
  if (diffMins < 60) return `${diffMins}m în urmă`;
  if (diffHours < 24) return `${diffHours}h în urmă`;
  if (diffDays < 7) return `${diffDays}z în urmă`;

  return date.toLocaleDateString();
}

export default function MessagesDashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { messages: sampleRequests, setMessages } = useMessages();
  const navigate = useNavigate();

  // Filter requests based on active tab and search query
  const filteredRequests = sampleRequests.filter((request) => {
    // Filter by tab
    if (activeTab === "unread" && request.unreadCount === 0) return false;
    if (
      activeTab !== "all" &&
      activeTab !== "unread" &&
      request.status !== activeTab
    )
      return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.title.toLowerCase().includes(query) ||
        (request.description &&
          request.description.toLowerCase().includes(query)) ||
        request.beneficiary.username.toLowerCase().includes(query) ||
        (request.volunteer &&
          request.volunteer.username.toLowerCase().includes(query)) ||
        (request.lastMessage &&
          request.lastMessage.content.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Calculate total unread messages
  const totalUnreadCount = sampleRequests.reduce(
    (sum, request) => sum + request.unreadCount,
    0
  );

  const markConversationReadHandler = async (requestId: string) => {
    await apiService.put(`/requests/messages/${requestId}/read`, null);

    setMessages((prev) =>
      prev.map((m) => (m.id === requestId ? { ...m, unreadCount: 0 } : m))
    );
  };

  const handleViewRequest = async (requestId: string) => {
    await markConversationReadHandler(requestId);

    navigate(`/app/requests/${requestId}`);
    console.log(`View request with ID: ${requestId}`);
  };

  return (
    <div className="min-h-scree">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center w-full justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold mb-0!">Mesaje</h2>
            </span>

            {totalUnreadCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {totalUnreadCount} unread
              </span>
            )}
          </div>
        </div>

        {/* Search and filter */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10! p-2.5! mb-0!"
                placeholder="Caută mesaje..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">Filtrează:</span>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="all">Toate mesajele</option>
                <option value="unread">Necitite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages list */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    request.unreadCount > 0
                      ? "bg-blue-50 hover:bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleViewRequest(request.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <h6 className="font-medium text-gray-900">
                          {request.title}
                        </h6>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {request.lastMessage
                            ? formatTime(request.lastMessage.timestamp)
                            : ""}
                        </span>
                      </div>

                      {request.lastMessage && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {request.lastMessage.isSystem ? (
                            <span className="italic">
                              {request.lastMessage.content}
                            </span>
                          ) : (
                            <>
                              <span className="font-medium">
                                {request.lastMessage.sender?.username ||
                                  "Unknown"}
                                :
                              </span>{" "}
                              {request.lastMessage.content}
                            </>
                          )}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            request.status === "open"
                              ? "bg-blue-100 text-blue-800"
                              : request.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "done"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status.replace("in_progress", "În progres ")}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            request.urgency === "high"
                              ? "bg-red-100 text-red-800"
                              : request.urgency === "medium"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                            {request.urgency === "high"
                           ? "Urgență ridicată"
                           : request.urgency === "medium"
                           ? "Urgență medie"
                           : "Urgență scăzută"}
                           </span>

                        {request.unreadCount > 0 && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 ml-auto">
                            {request.unreadCount} necitite
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        {request.beneficiary.profileImg && (
                          <div className="flex items-center">
                            <Avatar
                              user={
                                {
                                  username: request.beneficiary.username,
                                  profileImg: request.beneficiary.profileImg,
                                  isVerified: true,
                                } as UserModel
                              }
                            />
                            <Link
                              to={`/app/user/${request.beneficiary.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {request.beneficiary.username}
                            </Link>
                          </div>
                        )}

                        {request.volunteer && (
                          <>
                            <span className="mx-1">•</span>

                            {request.volunteer.profileImg && (
                              <div className="flex items-center">
                                <Avatar
                                  user={
                                    {
                                      username: request.volunteer.username,
                                      profileImg: request.volunteer.profileImg,
                                      isVerified: true,
                                    } as UserModel
                                  }
                                />
                                <Link
                                  to={`/app/user/${request.volunteer.id}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {request.volunteer.username}
                                </Link>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Nu sunt mesaje disponibile
              </h3>
              <p className="text-gray-500">
              {searchQuery
              ? "Niciun mesaj nu se potrivește cu criteriile de căutare"
               : activeTab === "unread"
                ? "Nu ai mesaje necitite"
               : activeTab !== "all"
                ? `Nu ai cereri ${activeTab.replace("_", " ")} cu mesaje`
               : "Nu ai niciun mesaj încă"}
                </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
