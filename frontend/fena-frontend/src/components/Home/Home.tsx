import { FormEvent, useEffect, useState } from "react";
import "./Home.scss";
import { handleSendBulkEmail } from "./services/home.service";
import socketIOClient from "socket.io-client";
import { JobResponse } from "./models/response";

export const Home = () => {
  const [numEmails, setNumEmails] = useState<number>(10);
  const [responseDelivered, setResponseDelivered] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<boolean>(false);
  const [responseValue, setResponseValue] = useState<JobResponse | null>(null);
  const [progress, setProgress] = useState({ progress: 0, total: 0 });
  const ENDPOINT = process.env.REACT_APP_API_URL_DEV;

  // Create a socket instance
  const socket = socketIOClient(ENDPOINT ? ENDPOINT : "http://localhost:8000/");

  useEffect(() => {
    // Set up the event listener
    socket.on("progress", (data: any) => {
      setProgress(data);
    });

    //Clean up the effect
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    socket.on("done", (data: any) => {
      setProgress(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendBulkEmail(numEmails).then((response: JobResponse | boolean) => {
      setResponseDelivered(true);
      setResponseStatus(response !== false ? true : false);
      if (response !== false) {
        setResponseValue(response as JobResponse);
      }

      setTimeout(() => {
        setResponseDelivered(false);
        setResponseStatus(false);
      }, 5000);
    });
  };

  return (
    <>
      <div className="mainPageWrapper">
        <form onSubmit={handleSubmit}>
          <label>Number of emails:</label>
          <input
            type="number"
            value={numEmails}
            onChange={(e) => setNumEmails(parseInt(e.target.value))}
          />
          <button type="submit" className="">
            SEND
          </button>
        </form>
        {responseValue && (
          <div className="mx-auto max-w-[250px]">
            <p>Status: {responseValue.message}</p>
            <p>JobId: {responseValue.jobId}</p>
          </div>
        )}
        {responseDelivered && (
          <>
            <p className={responseStatus ? "" : "error"}>
              {responseStatus
                ? "Emails sent successfully"
                : "An error occurred. Emails not sent"}
            </p>
          </>
        )}
        {progress.total > 0 && (
          <div>
            Progress: {progress.progress} / {progress.total}
          </div>
        )}
      </div>
    </>
  );
};
