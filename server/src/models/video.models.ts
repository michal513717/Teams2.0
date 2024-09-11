export type CallUserData = {
  offer: {
    sdp: string;
    type: "offer";
  };
  to: string;
};

export type MakeAnswerData = {
  answer: {
    sdp: string;
    type: "answer";
  };
  isCallAccepted: boolean;
  to: string;
};

export type CloseConnectionData = {
  to: string;
};
