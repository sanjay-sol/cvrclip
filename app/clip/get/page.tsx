"use client";
 
// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
 
// import { UploadButton } from "~/utils/uploadthing";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadFileResponse } from "uploadthing/client";
 
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton<OurFileRouter>
        endpoint="mediaPost"
        onClientUploadComplete={(res : UploadFileResponse[] | undefined) => {
          if(res){
            console.log("Files: ", res[0].url);
          }
          console.log("type: ", typeof res);
        //   console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
        
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}