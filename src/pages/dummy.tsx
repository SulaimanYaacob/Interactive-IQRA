// import { Button, Center, Container, Stack } from "@mantine/core";
// import { api } from "~/utils/api";

// function Dummy() {
//   // const { mutate } = api.liveblocks.createRoom.useMutation();
//   const { mutate } = api.liveblocks.deleteRoom.useMutation();

//   return (
//     <Container>
//       <Center my="xl">
//         <Stack>
//           {/* <Title>{data?.greeting.firstName}</Title> */}
//           <Button
//             color="red"
//             onClick={() =>
//               mutate({ roomId: "10fe0ce2-865e-4741-8b38-c7cc3c0f6491" })
//             }
//           >
//             Delete Room
//           </Button>
//         </Stack>
//       </Center>
//     </Container>
//   );
// }

// export default Dummy;

import { Center, Container, Stack } from "@mantine/core";
import { useState } from "react";

const MicRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioURL, setAudioURL] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        const audioBlob = new Blob([e.data], { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  return (
    <Container>
      <Center>
        <Stack>
          <button onClick={toggleRecording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          {audioURL && <audio controls src={audioURL} />}
        </Stack>
      </Center>
    </Container>
  );
};

export default MicRecorder;
