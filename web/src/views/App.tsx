import { useObserver } from "mobx-react";

export default function App() {
  return useObserver(() => (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      App
    </div>
  ));
}
