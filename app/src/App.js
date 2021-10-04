import React, { useState } from 'react';
import axios from "axios";

import "./App.css";

function App()
{
    const [realUrl, setRealUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();

    const createURL = () =>
    {   
        if (realUrl === "")
        {
            return;
        }
        
        setLoading(true);

        axios.post(process.env.REACT_APP_API_URL + "/create", { real_url: realUrl })
            .then((res) => setResponse(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));

        setRealUrl("");
    };

    return (
        <div className="content">
            <input placeholder="Enter the Real URL" onChange={(e) => setRealUrl(e.target.value)} value={realUrl} />

            <button onClick={() => createURL()}>Create</button>

            <br />
            <br />

            {loading && <p>Loading...</p>}

            {response && (
                <a href={process.env.REACT_APP_API_URL + "/r/" + response._id} target="_blank" rel="noreferrer">
                    {process.env.REACT_APP_API_URL + "/r/" + response._id}
                </a>
            )}
        </div>
    );
}

export default App;