import React, { useEffect, useState, useRef } from "react";
import { useChannel } from "ably/react";
import { useAbly } from "ably/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SendIcon, Plus, Users, MessageCircle, Search, Hash } from "lucide-react";
import { useUser } from "../context/UserContext";
import { resizeBase64Img } from "@/lib/utils";
import {
  createGroup,
  getAllGroups,
  addMessageToGroup,
  getGroupMessages,
} from "@/lib/actions/group.actions";
import { getUserByEmail } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

function ChatBox() {
  const ably = useAbly();
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const [user_, setUser_] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const channelName = "chat-demo1";
  const { data: session } = useSession();
  const user = useUser();
  const { channel } = useChannel(channelName, (message) => {
    if (message.data.group === currentGroup._id) {
      setMessages((prevMessages) => [...prevMessages, message.data]);
    }
  });

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [receivedMessages]);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsFromServer = await getAllGroups();
      const user_ = await getUserByEmail(session?.user?.email);
      setUser_(user_);
      setGroups(groupsFromServer);
    };
    fetchGroups();
  }, [session?.user?.email]);

  const handleCreateGroup = async (groupName) => {
    if (groupName && !groups.some((group) => group.name === groupName)) {
      const newGroup = await createGroup(groupName, user_._id);
      setGroups([...groups, newGroup]);
      setCurrentGroup(newGroup);
      setMessages([]);
      setNewGroupName("");
    }
  };

  const handleJoinGroup = async (groupId) => {
    const selectedGroup = groups.find((group) => group._id === groupId);
    setCurrentGroup(selectedGroup);

    const groupMessages = await getGroupMessages(groupId);
    const formattedMessages = groupMessages.map((msg) => ({
      ...msg,
      connectionId: msg.sender._id,
      name: `${msg.sender.firstName} ${msg.sender.lastName}`,
      image: msg.sender.photo || "/default-avatar.png",
      data: msg.text,
      timestamp: msg.timestamp,
    }));

    setMessages(formattedMessages);
  };

  const sendChatMessage = async (messageText) => {
    try {
      if (currentGroup && channel) {
        const resizedImage = await resizeBase64Img(user.photo, 100, 100);

        const message = {
          group: currentGroup._id,
          name: `${user.firstName} ${user.lastName}`,
          image: resizedImage,
          data: messageText,
          timestamp: new Date().toISOString(),
          connectionId: ably.connection.id,
        };

        await channel.publish("chat-message", message);
        await addMessageToGroup(currentGroup._id, user_._id, messageText);

        setMessageText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const renderedMessages = receivedMessages.map((message, index) => {
    const isMe = message.connectionId === ably.connection.id;
    return (
      <AnimatedContainer key={index} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
            isMe
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg ml-4"
              : "bg-background border border-border shadow-sm mr-4"
          }`}
        >
          <div className="mb-2 flex items-center">
            <img
              src={message.image || "/images/user/user-01.png"}
              alt={message.name}
              className="mr-2 h-8 w-8 rounded-full border-2 border-white/20"
            />
            <span className={`text-sm font-medium ${isMe ? "text-white/90" : "text-foreground"}`}>
              {message.name}
            </span>
          </div>
          <p className={`text-sm ${isMe ? "text-white" : "text-foreground"}`}>
            {message.data}
          </p>
          <span className={`text-xs mt-1 block ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </AnimatedContainer>
    );
  });

  return (
    <DefaultLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4 min-w-[300px] space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Discovery Chat
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with researchers and discuss drug discovery
            </p>
          </Card>

          {/* Create Group */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Create Group</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreateGroup(newGroupName);
                }}
                className="flex-1"
              />
              <Button
                onClick={() => handleCreateGroup(newGroupName)}
                disabled={!newGroupName.trim()}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Groups List */}
          <Card className="p-4 flex-1">
            <h3 className="font-semibold text-foreground mb-3">Groups</h3>
            <div className="space-y-2">
              {groups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => handleJoinGroup(group._id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentGroup?._id === group._id
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs opacity-70">
                        {group.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {groups.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No groups yet. Create one to get started!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentGroup ? (
            <>
              {/* Chat Header */}
              <Card className="p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {currentGroup.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentGroup.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Members
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Messages */}
              <Card className="flex-1 p-4 mb-4">
                <div className="h-full overflow-y-auto">
                  {renderedMessages.length > 0 ? (
                    <div className="space-y-4">
                      {renderedMessages}
                      <div ref={bottomRef}></div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Message Input */}
              <Card className="p-4">
                <form onSubmit={handleFormSubmission} className="flex gap-3">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!messageText.trim()}
                    size="lg"
                  >
                    <SendIcon className="w-4 h-4" />
                  </Button>
                </form>
              </Card>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to Discovery Chat
                </h3>
                <p className="text-muted-foreground">
                  Select a group to start chatting or create a new one
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ChatBox;
