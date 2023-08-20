import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

import { RoomContext } from "../contexts/RoomContext";

const stunConfig = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:a.relay.metered.ca:80",
      username: "50c0f437fa1d1fa37918241c",
      credential: "bnCmSUkMlm15l8N2",
    },
    {
      urls: "turn:a.relay.metered.ca:80?transport=tcp",
      username: "50c0f437fa1d1fa37918241c",
      credential: "bnCmSUkMlm15l8N2",
    },
    {
      urls: "turn:a.relay.metered.ca:443",
      username: "50c0f437fa1d1fa37918241c",
      credential: "bnCmSUkMlm15l8N2",
    },
  ],
};

// rtc peer connection objects
const pc1 = new RTCPeerConnection(stunConfig);
const pc2 = new RTCPeerConnection(stunConfig);

const MeetingRoomPage = () => {
  const { room, setRoom } = useContext(RoomContext);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [roomfull, setRoomfull] = useState(false);

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  pc1.onicecandidate = (e) => {
    console.log("pc1 : got an ice candidate ", e.candidate);
    // sharing ice candidate with local server
    socket.emit(
      "share:ice-cand",
      {
        roomName: room,
        icecandidate: e.candidate,
        peerid: 1,
      },
      () => {
        console.log("Shared pc1 icecandidate with the sig server");
      }
    );
  };

  pc2.onicecandidate = (e) => {
    console.log("pc2 : got an ice candidate ", e.candidate);
    socket.emit(
      "share:ice-cand",
      {
        roomName: room,
        icecandidate: e.candidate,
        peerid: 2,
      },
      () => {
        console.log("Shared pc2 icecandidate with the sig server");
      }
    );
  };

  pc2.ontrack = (e) => {
    console.log("pc2 on track triggered");
    console.log(e.streams[0].getTracks());
    remoteVideo.current.srcObject = e.streams[0];
  };

  const startStreaming = async () => {
    console.log("Start Streaming clicked ");

    // get the local video, audio stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localVideo.current.srcObject = stream;

    console.log("Got user permission : ", stream.getTracks());

    stream.getTracks().forEach((track) => {
      pc1.addTrack(track, stream);
    });
    console.log("Done with setting tracks of pc1");

    // geenrate offer
    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    console.log("pc1 created offer and set its own local desc");
    // share local desc with sig server
    socket.emit(
      "share:desc",
      {
        roomName: room,
        desc: offer,
        peerid: 1,
      },
      () => {
        console.log("Shared pc1 local descripion with signaling server");
      }
    );
  };

  useEffect(() => {
    if (!room) {
      navigate("/join");
    }

    const onMessage = (msg) => {
      console.log("received : ", msg);
    };

    const onServerMessage = (message) => {
      console.log(message);
    };

    const onCurrentParticipants = (participants) => {
      console.log("Current Participants in the room : " + participants);
      if (participants.length == 2) {
        setRoomfull(true);
      }
      alert(roomfull);
    };

    socket.on("send:msg", onMessage);
    socket.on("server-message", onServerMessage);
    socket.on("current-participants", onCurrentParticipants);

    const handleDesc = async ({ desc, peerid }) => {
      console.log(`Got desc of pc${peerid} from sig server : `, desc);
      if (peerid == "1") {
        //1- set remote desc of pc2
        //2- generate answer
        await pc2.setRemoteDescription(desc);
        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        socket.emit(
          "share:desc",
          {
            roomName: room,
            desc: answer,
            peerid: 2,
          },
          () => {
            console.log("Shared pc2 local descripion with signaling server");
          }
        );
      } else {
        // set remote description of pc1
        await pc1.setRemoteDescription(desc);
      }
    };

    const handleIce = ({ icecandidate, peerid }) => {
      console.log(`Got ice of pc${peerid} from sig server`, icecandidate);
      if (peerid == "1") {
        //1- add ice candidae of pc2
        pc2.addIceCandidate(icecandidate);
      } else {
        pc1.addIceCandidate(icecandidate);
      }
    };

    socket.on("add:desc", handleDesc);
    socket.on("add:ice-cand", handleIce);

    return () => {
      socket.off("send:msg", onMessage);
      socket.off("server-message", onServerMessage);
      socket.off("current-participants", onCurrentParticipants);

      socket.off("add:desc", handleDesc);
      socket.off("add:ice-cand", handleIce);
    };
  });

  const formHandler = (e) => {
    e.preventDefault();
    socket.emit("send:msg", { room, msg }, () => {
      console.log("message send.");
    });
  };

  return (
    <div>
      MeetingRoomPage room id ({room})
      <div>
        <video
          autoPlay
          width="200px"
          height="200px"
          ref={localVideo}
          style={{ background: "yellow" }}
        />
        <video
          autoPlay
          width="200px"
          height="200px"
          ref={remoteVideo}
          style={{ background: "green" }}
        />
      </div>
      <button disabled={!roomfull} onClick={startStreaming}>
        Start Streaming
      </button>
      <form onSubmit={formHandler}>
        <input
          type="text"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
      </form>
      <button
        onClick={() => {
          socket.emit("leave", room);
          navigate("/join");
        }}
      >
        Leave Room
      </button>
    </div>
  );
};

export default MeetingRoomPage;
