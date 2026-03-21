import { useState } from "react";
import "./App.css";

function getColorAndTag(rating){
  if(typeof rating !== "number"){
    return { color: "white", tag: "Unrated" };
  }

  if(rating < 1200) return { color: "#9ca3af", tag: "Newbie" };
  if(rating < 1400) return { color: "#22c55e", tag: "Pupil" };
  if(rating < 1600) return { color: "#06b6d4", tag: "Specialist" };
  if(rating < 1900) return { color: "#3b82f6", tag: "Expert" };
  if(rating < 2100) return { color: "#a855f7", tag: "Candidate Master" };
  if(rating < 2400) return { color: "#f97316", tag: "International Master" };
  return { color: "#ef4444", tag: "Grandmaster" };
}

function App(){
  const [handle, setHandle] = useState("");
  const [rating, setRating] = useState(null);
  const [maxrating, setMaxRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchRating(){
    if(!handle){
      setError("Enter handle ❌");
      return;
    }

    setError("");
    setLoading(true);

    try{
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const data = await res.json();

      if(data.status !== "OK"){
        setError("User not found ❌");
        setLoading(false);
        return;
      }

      const user = data.result[0];

      setRating(user.rating || "Unrated");
      setMaxRating(user.maxRating || "Unrated");
    }
    catch(err){
      console.log(err);
      setError("Something went wrong ❌");
    }

    setLoading(false);
  }

  const { color, tag } = getColorAndTag(rating);

  return (
    <div className="container">
      <div className="card">

        <img 
          src="https://sta.codeforces.com/s/91857/images/codeforces-logo-with-telegram.png"
          alt="Codeforces"
          className="logo"
        />

        <h2>Rating Checker</h2>

        <input
          className="input"
          type="text"
          placeholder="Enter handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") fetchRating();
          }}
        />

        <button 
          className="button" 
          onClick={fetchRating}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Rating"}
        </button>

        {error && <p className="error">{error}</p>}

        {rating !== null && (
          <div className="result">
            <h2 style={{ color }}>
              {tag}: {rating}
            </h2>

            <h3>
              Max Rating: {maxrating}
            </h3> 
            <a href={`https://codeforces.com/profile/${handle}`} target="_blank">
              View Profile
            </a>
          </div>
        )} 

      </div>
    </div>
  );
}

export default App;