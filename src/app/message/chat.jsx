"use client";

import * as Ably from "ably";
import ChatBox from "./chat-box.jsx";

export default function Chat() {
  const client = new Ably.Realtime({
    key: "L-u5Lw.3Q624A:Q8c0OHqRd4ZEdCbrKaJGetcwTXVbBgNAoaUMQBkPQjo",
  });
  return <ChatBox />;
}
