import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrentURL = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const getCurrentURL = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setUrl(tabs[0].url || "");
      }
    });
  };

  useEffect(() => {
    getCurrentURL();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/singleURL/${url}`
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center items-center mb-4">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 border rounded-l w-3/4 text-slate-900"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Submit
        </button>
      </div>

      <button
        onClick={getCurrentURL}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Get Current URL
      </button>

      {result && (
        <div className="flex flex-wrap w-full">
          <div className="w-full mb-4">
            <div
              className={`m-2 p-2 text-center ${
                result.is_phishing ? "bg-red-500" : "bg-green-500"
              } rounded-lg`}
              style={{
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span className="text-white">{result.url}</span>
            </div>
            <div
              className={`m-2 p-2 text-center ${
                result.is_phishing ? "bg-red-500" : "bg-green-500"
              } rounded-lg`}
              style={{
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span className="text-white">
                {result.is_phishing
                  ? "NOT SAFE! PHISHING"
                  : "SAFE NOT PHISHING"}
              </span>
            </div>
            <pre className="p-2 w-full">
              {result.features && (
                <div className="flex flex-wrap">
                  {Object.entries(result.features).map(([feature, value]) => (
                    <div
                      key={feature}
                      className={`m-2 p-2 ${
                        value === 0 ? "bg-green-500" : "bg-red-500"
                      } rounded-lg`}
                      style={{
                        boxShadow:
                          "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <span className="font-semibold text-white">
                        {feature === "getDomain" ? value : feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentURL;
