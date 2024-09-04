export type CallUserData = {
  offer: {
    sdp: string;
    type: "offer";
  };
  to: string;
  userName: string;
};

export type MakeAnswerData = {
  answer: {
    sdp: string;
    type: "answer";
  };
  isCallAccepted: boolean;
  to: string;
  userName: string;
};

export type CloseConnectionData = {
  to: string;
};

export type VideoContextType = {
  peerConnection: RTCPeerConnection;
  offer: RTCSessionDescription | null;
  isSecondCall: boolean;
  resetVideoContext: () => void;
  endCall: (userName: string) => void;
  callUser: (userName: string) => void;
  callAnswerMade: (isCallAccepted: boolean) => void;
};
