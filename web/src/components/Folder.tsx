import React from "react";
import "../styles/components/folder.scss";

interface FolderProps {
  name?: string;
  openFolder?: () => void;
  hover?: boolean;
}

const Folder: React.FC<FolderProps> = ({
  name = "",
  openFolder = () => {},
  hover = true,
}) => {
  return (
    <div
      onClick={() => {
        openFolder();
      }}
      className={`folder-container ${hover ? " allowhover" : ""}`}
    >
      <div className="file">
        <div className="work-5"></div>
        <div className="work-4"></div>
        <div className="work-3"></div>
        <div className="work-2"></div>
        <div className="work-1">
          {name ? <div className="folder-name">{name}</div> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Folder;
