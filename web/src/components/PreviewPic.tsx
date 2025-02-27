import React, { useState } from "react";
import "../styles/components/previewpic.scss";

interface PreviewPicProps {
  active: boolean;
  url: string;
  id: string;
  click: Function;
}

const PreviewPic: React.FC<PreviewPicProps> = ({ active, url, id, click }) => {
  const [picStatus, setPicStatus] = useState<"hide" | "show" | "load">("load");
  const handleError = () => {
    setPicStatus("hide");
  };
  const handleSuccess = () => {
    setPicStatus("show");
  };

  return (
    <div
      onClick={() => {
        click();
      }}
      id={id}
      className={`previewpic-container${active ? " active" : ""} ${picStatus}`}
    >
      <img
        className="previewpic-pic"
        src={url}
        alt="previewpic"
        loading="lazy"
        onLoad={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default PreviewPic;
