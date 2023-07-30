import { FormEvent, useEffect, useState } from "react";
import "./Home.scss"
import { handleSendBulkEmail } from "./services/home.service"
import socketIOClient from "socket.io-client";

export const Home = () => {
    const [numEmails, setNumEmails] = useState<number>(10);
    const [responseDelivered, setResponseDelivered] = useState<boolean>(false);
    const [responseStatus, setResponseStatus] = useState<boolean>(false);
    const [progress, setProgress] = useState({ progress: 0, total: 0 });

    const ENDPOINT = "http://localhost:8000";  // Replace this with your server's address

    // Create a socket instance
    const socket = socketIOClient(ENDPOINT);

    useEffect(() => {
 
        // Set up the event listener
        socket.on("progress", (data:any) => {
            console.log("WORKING",data)
          setProgress(data);
        });
      
        //Clean up the effect
        return () => {
          socket.disconnect();
        };
      
      },[socket]);

      useEffect(() => {

        socket.on("done", (data:any) => {
            console.log("DONE",data)
          setProgress(data);
        });
      
        //Clean up the effect
        return () => {
          socket.disconnect();
        };
      
      },[socket]);
      
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Button clicked!")
        handleSendBulkEmail(numEmails).then((response:boolean) => {
            setResponseDelivered(true);
            setResponseStatus(response);

            setTimeout(() => {
                setResponseDelivered(false);
                setResponseStatus(false);
            }, 5000);
        });

    }

    return (
       <>
            <div className="mainPageWrapper">
            <form onSubmit={handleSubmit}>
                <label>Number of emails:</label>
                <input type="number" value={numEmails} onChange={(e) => setNumEmails(parseInt(e.target.value))} />
                <button type="submit" className="">SEND</button>
            </form>
            { responseDelivered &&
            <>
              <p className={responseStatus ? "" : "error"}>
                {responseStatus ? "Emails sent successfully" : "An error occurred. Emails not sent"}
              </p>              
            </>
            }
            <div>Progress: {progress.progress} / {progress.total}</div>
            </div>
        </>
    )
}