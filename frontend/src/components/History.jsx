import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserHistory } from "../store/historyReducer";

export default function History () {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getUserHistory()).then(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-4 bg-container rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-secondary mb-4">History</h2>
      {history.length === 0 ? (
        <p className="text-gray-600">No history found. Ask me anything!</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {history.map((item) => (
            <li key={item.id} className="border-b border-gray-300 py-4">
              <h3 className="text-xl font-semibold text-primary">{item.idiom || item.term}</h3>
              <p className="text-gray-700">{item.meaning}</p>
              <p className="text-gray-600"><strong>Origin:</strong> {item.origin}</p>
              <p className="text-gray-600"><strong>Example:</strong> {item.exampleUse}</p>
              {item.equivalentInLanguage && (
                <p className="text-gray-600"><strong>Equivalent in Language:</strong> {item.equivalentInLanguage}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
